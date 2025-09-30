// src/db/sqlite.ts

import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<any> | null = null;

export function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('app.db');
  }
  return dbPromise!;
}

/**
 * Jalankan sekali di startup: buat tabel wajib & migrasi kolom hilang.
 * Aman dijalankan berulang (idempotent).
 */
export async function ensureSchema() {
  const db = await getDb();

  // Sedikit hygiene
  await db.execAsync('PRAGMA foreign_keys=ON;');

  // 1) Tabel kv untuk simpan versi skema
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS kv (
      k TEXT PRIMARY KEY,
      v TEXT NOT NULL
    );
  `);

  // helper ambil versi
  const cur = await db.getFirstAsync(`SELECT v FROM kv WHERE k='schema_version'`) as { v: string } | undefined;
  let version = cur ? Number(cur.v) : 0;

  // 2) Migrasi v1: buat tabel materials (kalau belum ada)
  if (version < 1) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        total_in INTEGER NOT NULL DEFAULT 0,
        total_out INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
    await db.runAsync(`INSERT OR REPLACE INTO kv (k, v) VALUES ('schema_version', '1');`);
    version = 1;
  }

  // 3) Migrasi v2: jika DB lama belum punya total_in/total_out → tambahkan
  if (version < 2) {
  const cols = await db.getAllAsync(`PRAGMA table_info(materials)`) as { name: string }[];
  const hasTotalIn  = cols.some((c: { name: string }) => c.name === 'total_in');
  const hasTotalOut = cols.some((c: { name: string }) => c.name === 'total_out');

    if (!hasTotalIn)  await db.execAsync(`ALTER TABLE materials ADD COLUMN total_in  INTEGER NOT NULL DEFAULT 0;`);
    if (!hasTotalOut) await db.execAsync(`ALTER TABLE materials ADD COLUMN total_out INTEGER NOT NULL DEFAULT 0;`);

    await db.runAsync(`INSERT OR REPLACE INTO kv (k, v) VALUES ('schema_version', '2');`);
    version = 2;
  }
}
