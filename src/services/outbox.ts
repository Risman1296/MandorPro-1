import * as FileSystem from 'expo-file-system';
import { v4 as uuid } from 'uuid';

// Use the correct constant - for SDK 54+ it should be available
const OUTBOX_DIR = (FileSystem as any).documentDirectory + 'outbox/';

export async function ensureOutboxDir() {
  const info = await FileSystem.getInfoAsync(OUTBOX_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(OUTBOX_DIR, { intermediates: true });
  }
}

export type Delta = {
  ts: string;
  device: string;
  user?: string;
  op: 'UPSERT' | 'DELETE';
  table: string;
  pk: string;
  data?: any;
};

export async function appendDelta(delta: Delta) {
  await ensureOutboxDir();
  const fname = new Date().toISOString().replace(/[:.]/g, '') + '.jsonl';
  const fpath = OUTBOX_DIR + fname;
  const line = JSON.stringify(delta) + '\n';
  
  // Check if file exists to determine whether to append or create new
  const exists = (await FileSystem.getInfoAsync(fpath)).exists;
  if (exists) {
    const existingContent = await FileSystem.readAsStringAsync(fpath, {
      encoding: 'utf8',
    });
    await FileSystem.writeAsStringAsync(fpath, existingContent + line, {
      encoding: 'utf8',
    });
  } else {
    await FileSystem.writeAsStringAsync(fpath, line, {
      encoding: 'utf8',
    });
  }
  return fpath;
}

export async function getOutboxFiles() {
  await ensureOutboxDir();
  const files = await FileSystem.readDirectoryAsync(OUTBOX_DIR);
  return files
    .filter(f => f.endsWith('.jsonl'))
    .map(f => OUTBOX_DIR + f);
}

export async function clearOutbox() {
  const files = await getOutboxFiles();
  for (const file of files) {
    await FileSystem.deleteAsync(file, { idempotent: true });
  }
}

export async function readOutboxFile(filePath: string): Promise<Delta[]> {
  const content = await FileSystem.readAsStringAsync(filePath, {
    encoding: 'utf8',
  });
  
  return content
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line) as Delta);
}