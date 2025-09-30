import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';
import { initDB } from '@/src/db/index';

export async function runSqlFile(relativePath: string) {
  if (Platform.OS === 'web') {
    console.warn('runSqlFile skipped on web (mock DB)');
    return;
  }
  const db = await initDB();
  if (!db) throw new Error('DB not initialized');

  // Load from app bundle using Expo Asset
  const assetModule = require(`@/${relativePath}`);
  const [asset] = await Asset.loadAsync(assetModule);
  const uri = asset.localUri || asset.uri;
  if (!uri) throw new Error(`Unable to resolve asset URI for ${relativePath}`);
  const sql = await FileSystem.readAsStringAsync(uri);
  await db.execAsync(sql);
}

export async function migrateAndSeed() {
  await runSqlFile('migrations/001_init.sqlite');
  await runSqlFile('migrations/001_seed.sqlite');
}
