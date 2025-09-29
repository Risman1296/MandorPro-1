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
  }
] as const;
