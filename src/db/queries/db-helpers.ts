// Use existing DB adapters (project-wide standard): run / all / get
// NOTE: if your adapters live in another path (e.g. '../adapters/sqlite'),
// adjust the import path accordingly.
import { run as _run, all as _all, get as _get } from '../adapters';

export function run(sql: string, params: any[] = []) {
  return _run(sql, params);
}
export function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return _all(sql, params);
}
export async function one<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const row = await _get<T>(sql, params);
  return (row as any) ?? null;
}
