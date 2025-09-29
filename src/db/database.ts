import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

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
