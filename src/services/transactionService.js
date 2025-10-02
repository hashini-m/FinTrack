import * as Crypto from "expo-crypto";
import { openDB } from "../storage/db";

// helper to generate unique ids
async function generateId() {
  return await Crypto.randomUUID();
}

// Insert a new transaction
export async function addTransaction({
  user_id,
  type,
  amount,
  category,
  note,
  photo_uri,
  latitude,
  longitude,
}) {
  const db = await openDB();
  const id = await generateId();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO transactions (id, user_id, type, amount, category, note, created_at, photo_uri, latitude, longitude, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      id,
      user_id,
      type,
      amount,
      category || null,
      note || null,
      createdAt,
      photo_uri || null,
      latitude || null,
      longitude || null,
    ]
  );

  return {
    id,
    user_id,
    type,
    amount,
    category,
    note,
    created_at: createdAt,
    photo_uri,
    latitude,
    longitude,
    synced: 0,
  };
}

// Fetch all transactions for a given user
export async function getTransactions(user_id) {
  const db = await openDB();
  const result = await db.getAllAsync(
    `SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC`,
    [user_id]
  );
  return result;
}

// Count unsynced transactions
export async function countPendingTransactions(user_id) {
  const db = await openDB();
  const result = await db.getAllAsync(
    `SELECT COUNT(*) as count FROM transactions WHERE user_id = ? AND synced = 0`,
    [user_id]
  );
  return result[0]?.count || 0;
}
