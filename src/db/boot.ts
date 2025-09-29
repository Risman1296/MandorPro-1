// Thin boot wrapper to reuse the existing async DB singleton
// and provide the initDb() API expected by app startup.
import { initDB } from '@/src/db/index';

export async function initDb(): Promise<void> {
  await initDB();
}
