// Database Index - Async Singleton Pattern
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let isInitialized = false;
let initPromise: Promise<SQLite.SQLiteDatabase | null> | null = null;

export async function initDB(): Promise<SQLite.SQLiteDatabase | null> {
  // Return existing promise if already initializing
  if (initPromise) {
    return initPromise;
  }

  // Return instance if already initialized
  if (isInitialized && dbInstance) {
    return dbInstance;
  }

  // Create initialization promise
  initPromise = _initializeDatabase();
  
  try {
    dbInstance = await initPromise;
    isInitialized = true;
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    initPromise = null;
    return null;
  }
}

async function _initializeDatabase(): Promise<SQLite.SQLiteDatabase | null> {
  // For web platform, return null to use mock data instead
  if (Platform.OS === 'web') {
    console.log('Web platform detected, using mock data instead of SQLite');
    return null;
  }

  try {
    const db = await SQLite.openDatabaseAsync('lapangan.db');
    
    // Enable foreign keys and WAL mode for better performance
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = WAL;
    `);
    
    // Run migrations
    await _runMigrations(db);
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    return null;
  }
}

async function _runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
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
      unit_type TEXT, 
      unit_number TEXT, 
      floor_level INTEGER, 
      building_block TEXT, 
      created_at TEXT, 
      updated_at TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (unit_type) REFERENCES unit_types(type_code)
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS wbs_items (
      id TEXT PRIMARY KEY, 
      project_id TEXT, 
      parent_id TEXT, 
      code TEXT, 
      name TEXT, 
      unit_measurement TEXT, 
      unit_price REAL, 
      level INTEGER, 
      created_at TEXT, 
      updated_at TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (parent_id) REFERENCES wbs_items(id)
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS unit_progress (
      id TEXT PRIMARY KEY, 
      unit_id TEXT, 
      wbs_id TEXT, 
      qty_planned REAL, 
      qty_done REAL, 
      percent_done REAL, 
      photos TEXT, 
      notes TEXT, 
      has_qc BOOLEAN, 
      created_at TEXT, 
      updated_at TEXT,
      FOREIGN KEY (unit_id) REFERENCES units(id),
      FOREIGN KEY (wbs_id) REFERENCES wbs_items(id)
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS progress_photos (
      id TEXT PRIMARY KEY, 
      progress_id TEXT, 
      file_path TEXT, 
      file_size INTEGER, 
      mime_type TEXT, 
      caption TEXT, 
      taken_at TEXT, 
      created_at TEXT, 
      updated_at TEXT,
      FOREIGN KEY (progress_id) REFERENCES unit_progress(id)
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS site_diary (
      id TEXT PRIMARY KEY, 
      project_id TEXT, 
      date TEXT, 
      weather TEXT, 
      temperature TEXT, 
      work_description TEXT, 
      worker_count INTEGER, 
      material_deliveries TEXT, 
      issues TEXT, 
      photos TEXT, 
      created_at TEXT, 
      updated_at TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS diary_photos (
      id TEXT PRIMARY KEY, 
      diary_id TEXT, 
      file_path TEXT, 
      file_size INTEGER, 
      mime_type TEXT, 
      caption TEXT, 
      taken_at TEXT, 
      created_at TEXT, 
      updated_at TEXT,
      FOREIGN KEY (diary_id) REFERENCES site_diary(id)
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS workers (
      id TEXT PRIMARY KEY, 
      name TEXT, 
      skill TEXT, 
      daily_wage REAL, 
      phone TEXT, 
      active BOOLEAN, 
      created_at TEXT, 
      updated_at TEXT
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY, 
      worker_id TEXT, 
      project_id TEXT, 
      date TEXT, 
      check_in TEXT, 
      check_out TEXT, 
      hours_worked REAL, 
      overtime_hours REAL, 
      notes TEXT, 
      created_at TEXT, 
      updated_at TEXT,
      FOREIGN KEY (worker_id) REFERENCES workers(id),
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS payroll_weeks (
      id TEXT PRIMARY KEY, 
      project_id TEXT, 
      week_start TEXT, 
      week_end TEXT, 
      status TEXT, 
      created_at TEXT, 
      updated_at TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS payroll_lines (
      id TEXT PRIMARY KEY, 
      payroll_week_id TEXT, 
      worker_id TEXT, 
      regular_hours REAL, 
      overtime_hours REAL, 
      daily_wage REAL, 
      overtime_rate REAL, 
      total_pay REAL, 
      created_at TEXT, 
      updated_at TEXT,
      FOREIGN KEY (payroll_week_id) REFERENCES payroll_weeks(id),
      FOREIGN KEY (worker_id) REFERENCES workers(id)
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS materials (
      id TEXT PRIMARY KEY, 
      name TEXT, 
      unit TEXT, 
      current_stock REAL, 
      unit_price REAL, 
      supplier TEXT, 
      created_at TEXT, 
      updated_at TEXT
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS stock_ledger (
      id TEXT PRIMARY KEY, 
      material_id TEXT, 
      project_id TEXT, 
      unit_id TEXT, 
      transaction_type TEXT, 
      quantity REAL, 
      unit_price REAL, 
      reference_doc TEXT, 
      notes TEXT, 
      transaction_date TEXT, 
      created_at TEXT, 
      updated_at TEXT,
      FOREIGN KEY (material_id) REFERENCES materials(id),
      FOREIGN KEY (project_id) REFERENCES projects(id),
      FOREIGN KEY (unit_id) REFERENCES units(id)
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY, 
      user_id TEXT, 
      action TEXT, 
      table_name TEXT, 
      record_id TEXT, 
      old_values TEXT, 
      new_values TEXT, 
      created_at TEXT
    );`);

    await db.execAsync(`CREATE TABLE IF NOT EXISTS sync_outbox (
      id TEXT PRIMARY KEY, 
      table_name TEXT, 
      action TEXT, 
      record_id TEXT, 
      data TEXT, 
      created_at TEXT, 
      synced BOOLEAN
    );`);

    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

export function getDB(): SQLite.SQLiteDatabase | null {
  if (!isInitialized) {
    console.warn('Database not initialized. Call initDB() first.');
    return null;
  }
  return dbInstance;
}

export function isDBInitialized(): boolean {
  return isInitialized;
}

// For backward compatibility
export { dbInstance as db };