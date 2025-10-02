// import NetInfo from "@react-native-community/netinfo";
// import { dbRemote } from "../firebase";
// import { openDB } from "../storage/db";
// import { collection, doc, setDoc } from "firebase/firestore";
// import { auth } from "../firebase";

// export async function syncPendingTransactions() {
//   const state = await NetInfo.fetch();
//   if (!state.isConnected || !auth.currentUser) return;

//   const db = await openDB();

//   // Get unsynced transactions
//   const pending = await db.getAllAsync(
//     `SELECT * FROM transactions WHERE user_id = ? AND synced = 0`,
//     [auth.currentUser.uid]
//   );

//   for (const tx of pending) {
//     try {
//       const ref = doc(
//         collection(dbRemote, "users", auth.currentUser.uid, "transactions"),
//         tx.id
//       );

//       // push to Firestore
//       await setDoc(ref, {
//         id: tx.id,
//         type: tx.type,
//         amount: tx.amount,
//         category: tx.category,
//         note: tx.note,
//         created_at: tx.created_at,
//         latitude: tx.latitude,
//         longitude: tx.longitude,
//         photo_uri: tx.photo_uri, // local path only (since no Firebase Storage)
//       });

//       // mark as synced in SQLite
//       await db.runAsync(`UPDATE transactions SET synced = 1 WHERE id = ?`, [
//         tx.id,
//       ]);
//     } catch (e) {
//       console.log("sync error", e);
//     }
//   }
// }

import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { dbRemote, auth } from "../firebase";
import { openDB } from "../storage/db";
import NetInfo from "@react-native-community/netinfo";

// Push unsynced local data → Firestore
export async function syncPendingTransactions() {
  const state = await NetInfo.fetch();
  if (!state.isConnected || !auth.currentUser) return;

  const db = await openDB();
  const pending = await db.getAllAsync(
    `SELECT * FROM transactions WHERE user_id = ? AND synced = 0`,
    [auth.currentUser.uid]
  );

  for (const tx of pending) {
    try {
      const ref = doc(
        collection(dbRemote, "users", auth.currentUser.uid, "transactions"),
        tx.id
      );

      await setDoc(ref, { ...tx }); // store full transaction
      await db.runAsync(`UPDATE transactions SET synced = 1 WHERE id = ?`, [
        tx.id,
      ]);
    } catch (e) {
      console.log("sync error (push)", e);
    }
  }
}

// Pull Firestore → SQLite
export async function syncFromFirestore() {
  if (!auth.currentUser) return;
  const db = await openDB();

  try {
    const snapshot = await getDocs(
      collection(dbRemote, "users", auth.currentUser.uid, "transactions")
    );

    for (const docSnap of snapshot.docs) {
      const tx = docSnap.data();

      // Check if exists locally
      const local = await db.getAllAsync(
        `SELECT id FROM transactions WHERE id = ?`,
        [tx.id]
      );

      if (local.length === 0) {
        // Insert new from Firestore
        await db.runAsync(
          `INSERT INTO transactions 
          (id, user_id, type, amount, category, note, created_at, updated_at, deleted, photo_uri, latitude, longitude, synced)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            tx.id,
            tx.user_id,
            tx.type,
            tx.amount,
            tx.category,
            tx.note,
            tx.created_at,
            tx.updated_at || null,
            tx.deleted || 0,
            tx.photo_uri || null,
            tx.latitude || null,
            tx.longitude || null,
          ]
        );
      } else {
        // Optional: update existing record if Firestore is newer
        await db.runAsync(
          `UPDATE transactions SET 
             type=?, amount=?, category=?, note=?, updated_at=?, deleted=?, photo_uri=?, latitude=?, longitude=?, synced=1
           WHERE id=?`,
          [
            tx.type,
            tx.amount,
            tx.category,
            tx.note,
            tx.updated_at || tx.created_at,
            tx.deleted || 0,
            tx.photo_uri || null,
            tx.latitude || null,
            tx.longitude || null,
            tx.id,
          ]
        );
      }
    }
  } catch (e) {
    console.log("sync error (pull)", e);
  }
}

export async function fullSync() {
  await syncPendingTransactions(); // push local → cloud
  await syncFromFirestore(); // pull cloud → local
}
