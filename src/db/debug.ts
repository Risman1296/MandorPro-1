// src/db/debug.ts
import { getDb } from './sqlite';

export async function logSchema() {
  const db = await getDb();
  const tables = await db.getAllAsync(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY 1`) as { name: string }[];
  console.log('Tables:', tables.map((t: { name: string }) => t.name));
  const cols = await db.getAllAsync(`PRAGMA table_info(materials)`) as { name: string }[];
  console.log('materials columns:', cols.map((c: { name: string }) => c.name));
}
