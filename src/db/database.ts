import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { all, run } from '@/src/db/adapters';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function openDb(): Promise<SQLite.SQLiteDatabase | null> {
  // For web platform, return null to use mock data instead
  if (Platform.OS === 'web') {
    console.log('Web platform detected, using mock data instead of SQLite');
    return null;
  }

  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await SQLite.openDatabaseAsync('lapangan.db');
    
    // Enable foreign keys and WAL mode for better performance
    await dbInstance.execAsync(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;
    `);
    
    return dbInstance;
  } catch (error) {
    console.error('Failed to open database:', error);
    return null;
  }
}

export async function migrate() {
  const db = await openDb();
  
  // Skip migration on web platform
  if (!db) {
    console.log('Skipping database migration on web platform');
    return;
  }
  
  try {
    // Projects and Units
    await db.execAsync(`CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY, 
      name TEXT, 
      code TEXT, 
      start_date TEXT, 
      end_date TEXT, 
      created_at TEXT, 
      updated_at TEXT
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS unit_types (
      type_code TEXT PRIMARY KEY, 
      name TEXT
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS units (
      id TEXT PRIMARY KEY, 
      project_id TEXT, 
      block TEXT, 
      number TEXT, 
      type_code TEXT, 
      status TEXT, 
      created_at TEXT, 
      updated_at TEXT
    );`);

    // Work Breakdown Structure
    await db.execAsync(`CREATE TABLE IF NOT EXISTS wbs_items (
      id TEXT PRIMARY KEY, 
      type_code TEXT, 
      code TEXT, 
      name TEXT, 
      uom TEXT, 
      qty_total REAL, 
      weight_pct REAL, 
      piecework_total REAL, 
      order_index INTEGER
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS unit_progress (
      id TEXT PRIMARY KEY, 
      unit_id TEXT, 
      wbs_id TEXT, 
      date TEXT, 
      qty_done REAL, 
      percent_done REAL, 
      has_qc INTEGER, 
      created_by TEXT, 
      created_at TEXT, 
      updated_at TEXT
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS progress_photos (
      id TEXT PRIMARY KEY, 
      unit_progress_id TEXT, 
      uri TEXT, 
      lat REAL, 
      lon REAL, 
      taken_at TEXT, 
      note TEXT
    );`);

    // Site Diary (Daily Documentation)
    await db.execAsync(`CREATE TABLE IF NOT EXISTS site_diary (
      id TEXT PRIMARY KEY, 
      project_id TEXT, 
      date TEXT, 
      shift TEXT, 
      weather TEXT, 
      workforce INTEGER, 
      notes TEXT, 
      created_at TEXT, 
      updated_at TEXT
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS diary_photos (
      id TEXT PRIMARY KEY, 
      diary_id TEXT, 
      uri TEXT, 
      lat REAL, 
      lon REAL, 
      taken_at TEXT, 
      note TEXT
    );`);

    // Workers and Attendance
    await db.execAsync(`CREATE TABLE IF NOT EXISTS workers (
      id TEXT PRIMARY KEY, 
      name TEXT, 
      skill TEXT, 
      daily_wage REAL, 
      phone TEXT, 
      active INTEGER
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY, 
      worker_id TEXT, 
      project_id TEXT, 
      date TEXT, 
      check_in_time TEXT, 
      check_out_time TEXT, 
      method TEXT, 
      device_id TEXT
    );`);

    // Payroll
    await db.execAsync(`CREATE TABLE IF NOT EXISTS payroll_weeks (
      id TEXT PRIMARY KEY, 
      project_id TEXT, 
      week_start TEXT, 
      week_end TEXT, 
      status TEXT
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS payroll_lines (
      id TEXT PRIMARY KEY, 
      payroll_week_id TEXT, 
      worker_id TEXT, 
      days_present REAL, 
      overtime_hours REAL, 
      piecework_amt REAL, 
      gross_pay REAL, 
      notes TEXT
    );`);

    // Materials and Stock
    await db.execAsync(`CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY, 
      code TEXT, 
      name TEXT, 
      uom TEXT, 
      min_stock REAL, 
      lead_time_days INTEGER
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS stock_ledger (
      id TEXT PRIMARY KEY, 
      project_id TEXT, 
      material_id TEXT, 
      date_time TEXT, 
      type TEXT, 
      qty REAL, 
      ref TEXT, 
      note TEXT, 
      unit_id TEXT, 
      wbs_id TEXT
    );`);

    // Audit and Sync
    await db.execAsync(`CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY, 
      table_name TEXT, 
      row_id TEXT, 
      action TEXT, 
      user_id TEXT, 
      ts TEXT, 
      device_id TEXT
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS sync_outbox (
      id TEXT PRIMARY KEY, 
      table_name TEXT, 
      row_id TEXT, 
      op TEXT, 
      payload_json TEXT, 
      ts TEXT, 
      device_id TEXT
    );`);

    console.log('Database migration completed successfully');
  } catch (error) {
    console.error('Database migration failed:', error);
    throw error;
  }
}

// Admin DB helpers (scope-aware for schema.ts with scope column)
export async function getCounts(scope = 'DEMO') {
  const q = async (sql: string, args: any[] = []) => {
    const rows = await all(sql, args);
    const first: any = Array.isArray(rows) ? rows[0] : undefined;
    return first?.c ?? 0;
  };
  return {
    materials: await q('SELECT COUNT(*) c FROM materials WHERE scope=?', [scope]),
    ledger: await q('SELECT COUNT(*) c FROM material_ledger WHERE scope=?', [scope]).catch(async () =>
      // fallback to stock_ledger name in older schema
      await q('SELECT COUNT(*) c FROM stock_ledger WHERE project_id=?', [scope])
    ),
    workers: await q('SELECT COUNT(*) c FROM workers WHERE scope=?', [scope]).catch(async () =>
      await q('SELECT COUNT(*) c FROM workers WHERE active=1')
    ),
    projects: await q('SELECT COUNT(*) c FROM projects WHERE scope=?', [scope]).catch(async () =>
      await q('SELECT COUNT(*) c FROM projects')
    ),
    attendance: await q('SELECT COUNT(*) c FROM attendance WHERE scope=?', [scope]).catch(async () =>
      await q('SELECT COUNT(*) c FROM attendance')
    ),
  };
}

export async function vacuum() {
  try { await run('VACUUM'); } catch {}
}

export async function exportScopeAsJson(scope = 'DEMO') {
  const tryAll = async (sql: string, args: any[] = []) => {
    try { return await all(sql, args); } catch { return []; }
  };
  const dump = {
    materials: await tryAll('SELECT * FROM materials WHERE scope=?', [scope]),
    material_ledger: await tryAll('SELECT * FROM material_ledger WHERE scope=?', [scope]),
    workers: await tryAll('SELECT * FROM workers WHERE scope=?', [scope]),
    projects: await tryAll('SELECT * FROM projects WHERE scope=?', [scope]),
    attendance: await tryAll('SELECT * FROM attendance WHERE scope=?', [scope]),
  } as Record<string, any[]>;
  // Fallback for legacy table names/columns
  if (!dump.material_ledger.length) dump.material_ledger = await tryAll('SELECT * FROM stock_ledger WHERE project_id=?', [scope]);
  if (!dump.workers.length) dump.workers = await tryAll('SELECT * FROM workers WHERE active=1');
  if (!dump.projects.length) dump.projects = await tryAll('SELECT * FROM projects');
  if (!dump.attendance.length) dump.attendance = await tryAll('SELECT * FROM attendance');
  return JSON.stringify(dump, null, 2);
}
