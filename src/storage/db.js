import * as SQLite from "expo-sqlite";

let db;

export async function openDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("fintrack.db");
  }
  return db;
}

export async function runMigrations() {
  const database = await openDB();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'LKR',
      category TEXT,
      note TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      deleted INTEGER DEFAULT 0,
      photo_uri TEXT,
      latitude REAL,
      longitude REAL,
      synced INTEGER DEFAULT 0
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL
    );
  `);
}

export default openDB;
