PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;
-- =========================
-- MASTER TABLES
-- =========================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  start_at INTEGER,
  due_at INTEGER,
  budget REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS project_sites (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT,
  lat REAL,
  lng REAL,
  radius_m INTEGER DEFAULT 50,
  note TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS workers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  phone TEXT,
  active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS material_master (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  unit TEXT NOT NULL
);
-- =========================
-- TASK MANAGEMENT
-- =========================
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id TEXT,
  start_at INTEGER,
  due_at INTEGER,
  status TEXT DEFAULT 'TODO',
  priority TEXT DEFAULT 'MEDIUM',
  progress INTEGER DEFAULT 0,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES workers(id)
);
CREATE TABLE IF NOT EXISTS task_dependencies (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  depends_on_task_id TEXT NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (depends_on_task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  name TEXT NOT NULL,
  at_date INTEGER NOT NULL,
  note TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
-- =========================
-- ATTENDANCE & TIMESHEET
-- =========================
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  worker_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  type TEXT CHECK (type IN ('CHECKIN', 'CHECKOUT')),
  at_ts INTEGER NOT NULL,
  lat REAL,
  lng REAL,
  accuracy REAL,
  method TEXT DEFAULT 'MANUAL',
  note TEXT,
  FOREIGN KEY (worker_id) REFERENCES workers(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
CREATE TABLE IF NOT EXISTS timesheets (
  worker_id TEXT NOT NULL,
  project_id TEXT NOT NULL,
  date TEXT NOT NULL,
  minutes_worked INTEGER DEFAULT 0,
  overtime_minutes INTEGER DEFAULT 0,
  PRIMARY KEY (worker_id, project_id, date),
  FOREIGN KEY (worker_id) REFERENCES workers(id),
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
-- =========================
-- MATERIAL LEDGER & PROCUREMENT
-- =========================
CREATE TABLE IF NOT EXISTS material_ledger (
  id TEXT PRIMARY KEY,
  material_id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  ref_type TEXT NOT NULL,
  ref_id TEXT,
  qty_delta REAL NOT NULL,
  unit_cost REAL DEFAULT 0,
  note TEXT,
  FOREIGN KEY (material_id) REFERENCES material_master(id)
);
CREATE TABLE IF NOT EXISTS po (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  supplier TEXT,
  ordered_at INTEGER NOT NULL,
  status TEXT DEFAULT 'OPEN',
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
CREATE TABLE IF NOT EXISTS po_items (
  id TEXT PRIMARY KEY,
  po_id TEXT NOT NULL,
  material_id TEXT NOT NULL,
  qty REAL NOT NULL,
  unit_cost REAL DEFAULT 0,
  FOREIGN KEY (po_id) REFERENCES po(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES material_master(id)
);
CREATE TABLE IF NOT EXISTS grn (
  id TEXT PRIMARY KEY,
  po_id TEXT,
  received_at INTEGER NOT NULL,
  by_user TEXT,
  FOREIGN KEY (po_id) REFERENCES po(id)
);
CREATE TABLE IF NOT EXISTS grn_items (
  id TEXT PRIMARY KEY,
  grn_id TEXT NOT NULL,
  material_id TEXT NOT NULL,
  qty REAL NOT NULL,
  unit_cost REAL DEFAULT 0,
  FOREIGN KEY (grn_id) REFERENCES grn(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES material_master(id)
);
-- =========================
-- PAYROLL & COST
-- =========================
CREATE TABLE IF NOT EXISTS payroll_runs (
  id TEXT PRIMARY KEY,
  period_start INTEGER NOT NULL,
  period_end INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  status TEXT DEFAULT 'DRAFT'
);
CREATE TABLE IF NOT EXISTS payroll_items (
  id TEXT PRIMARY KEY,
  payroll_run_id TEXT NOT NULL,
  worker_id TEXT NOT NULL,
  regular_minutes INTEGER DEFAULT 0,
  overtime_minutes INTEGER DEFAULT 0,
  gross_pay REAL DEFAULT 0,
  note TEXT,
  FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES workers(id)
);
CREATE TABLE IF NOT EXISTS project_costs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  category TEXT,
  amount REAL NOT NULL,
  ref_type TEXT,
  ref_id TEXT,
  note TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
-- =========================
-- VIEWS
-- =========================
CREATE VIEW IF NOT EXISTS v_material_stock AS
SELECT material_id,
  COALESCE(SUM(qty_delta), 0) AS qty
FROM material_ledger
GROUP BY material_id;
CREATE VIEW IF NOT EXISTS v_timesheet_summary AS
SELECT worker_id,
  project_id,
  SUM(minutes_worked) as total_minutes,
  SUM(overtime_minutes) as total_overtime
FROM timesheets
GROUP BY worker_id,
  project_id;
CREATE VIEW IF NOT EXISTS v_project_cost AS
SELECT project_id,
  category,
  SUM(amount) as total_amount
FROM project_costs
GROUP BY project_id,
  category;
COMMIT;
-- Manual migration for workers table (add status, project_id)
ALTER TABLE workers
ADD COLUMN status TEXT DEFAULT 'Aktif';
ALTER TABLE workers
ADD COLUMN project_id TEXT;