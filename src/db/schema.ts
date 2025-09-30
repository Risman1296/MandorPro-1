export const MIGRATIONS = [
  {
    to: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS kv (
         key TEXT PRIMARY KEY,
         value TEXT
       );`,

      `CREATE TABLE IF NOT EXISTS projects (
         id TEXT PRIMARY KEY,
         code TEXT,
         name TEXT NOT NULL,
         status TEXT NOT NULL DEFAULT 'active',
         scope TEXT NOT NULL DEFAULT 'DEMO'
       );`,

      `CREATE TABLE IF NOT EXISTS workers (
         id TEXT PRIMARY KEY,
         name TEXT NOT NULL,
         role TEXT,
         rate REAL DEFAULT 0,
         active INTEGER NOT NULL DEFAULT 1,
         scope TEXT NOT NULL DEFAULT 'DEMO'
       );`,

      `CREATE TABLE IF NOT EXISTS materials (
         id TEXT PRIMARY KEY,
         name TEXT NOT NULL,
         unit TEXT,
         total_in REAL DEFAULT 0,
         total_out REAL DEFAULT 0,
         scope TEXT NOT NULL DEFAULT 'DEMO'
       );`,

      `CREATE TABLE IF NOT EXISTS material_ledger (
         id TEXT PRIMARY KEY,
         material_id TEXT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
         ts INTEGER NOT NULL,
         delta_in REAL DEFAULT 0,
         delta_out REAL DEFAULT 0,
         project_id TEXT REFERENCES projects(id),
         note TEXT,
         scope TEXT NOT NULL DEFAULT 'DEMO'
       );`,

      `CREATE VIEW IF NOT EXISTS v_material_stock AS
         SELECT m.id, m.name, m.unit, m.scope,
                COALESCE(m.total_in, 0) + COALESCE(SUM(l.delta_in),0) AS total_in,
                COALESCE(m.total_out,0) + COALESCE(SUM(l.delta_out),0) AS total_out,
                (COALESCE(m.total_in,0) + COALESCE(SUM(l.delta_in),0))
                - (COALESCE(m.total_out,0) + COALESCE(SUM(l.delta_out),0)) AS balance
         FROM materials m
         LEFT JOIN material_ledger l ON l.material_id = m.id
         GROUP BY m.id;`,

      `CREATE TABLE IF NOT EXISTS attendance (
         id TEXT PRIMARY KEY,
         worker_id TEXT NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
         project_id TEXT REFERENCES projects(id),
         day TEXT NOT NULL,
         hours REAL DEFAULT 0,
         scope TEXT NOT NULL DEFAULT 'DEMO'
       );`
    ]
  },
  {
    to: 2,
    statements: [
      `DROP TABLE IF EXISTS attendance;`,
      `CREATE TABLE attendance (
         id TEXT PRIMARY KEY,
         worker_id TEXT NOT NULL REFERENCES workers(id),
         project_id TEXT NOT NULL REFERENCES projects(id),
         type TEXT NOT NULL,
         at_ts INTEGER NOT NULL,
         lat REAL,
         lng REAL,
         accuracy REAL,
         method TEXT,
         note TEXT,
         scope TEXT NOT NULL DEFAULT 'DEMO'
       );`,
      `CREATE TABLE tasks (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL REFERENCES projects(id),
        title TEXT NOT NULL,
        desc TEXT,
        assignee_id TEXT REFERENCES workers(id),
        start_at INTEGER,
        due_at INTEGER,
        status TEXT NOT NULL DEFAULT 'todo',
        priority TEXT,
        progress INTEGER DEFAULT 0,
        scope TEXT NOT NULL DEFAULT 'DEMO'
      );`,
      `CREATE INDEX idx_tasks_project ON tasks(project_id);`,
      `CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);`,
      `CREATE INDEX idx_tasks_due ON tasks(due_at);`,
      `CREATE TABLE task_dependencies (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL REFERENCES tasks(id),
        depends_on_task_id TEXT NOT NULL REFERENCES tasks(id),
        scope TEXT NOT NULL DEFAULT 'DEMO'
      );`,
      `CREATE TABLE milestones (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL REFERENCES projects(id),
        name TEXT NOT NULL,
        at_date INTEGER NOT NULL,
        note TEXT,
        scope TEXT NOT NULL DEFAULT 'DEMO'
      );`,
      `CREATE TABLE timesheets (
        worker_id TEXT NOT NULL REFERENCES workers(id),
        project_id TEXT NOT NULL REFERENCES projects(id),
        date TEXT NOT NULL,
        minutes_worked INTEGER DEFAULT 0,
        overtime_minutes INTEGER DEFAULT 0,
        scope TEXT NOT NULL DEFAULT 'DEMO',
        PRIMARY KEY (worker_id, project_id, date)
      );`,
      `CREATE TABLE project_sites (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL REFERENCES projects(id),
        name TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        radius_m INTEGER NOT NULL,
        scope TEXT NOT NULL DEFAULT 'DEMO'
      );`
    ]
  }
] as const;
