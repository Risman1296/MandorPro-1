BEGIN TRANSACTION;
-- Seed projects (pastikan id sesuai referensi pekerja)
INSERT
  OR IGNORE INTO projects (id, name, status)
VALUES (
    'palipui',
    'To Palipui Residence',
    'Pengembangan'
  ),
  ('makkaturang1', 'To Makkaturang 1', 'Konstruksi'),
  ('tmr', 'TMR Hightown Islamic', 'Selesai');
-- Seed workers
INSERT INTO workers (name, role, status, project_id)
VALUES (
    'Budi Santoso',
    'Tukang Bangunan',
    'Aktif',
    'palipui'
  ),
  (
    'Joko Widodo',
    'Tukang Bangunan',
    'Aktif',
    'makkaturang1'
  ),
  (
    'Rudi Hartono',
    'Tukang Bangunan',
    'Aktif',
    'makkaturang1'
  ),
  (
    'Ahmad Fauzi',
    'Tukang Bangunan',
    'Aktif',
    'makkaturang1'
  ),
  (
    'Slamet Riyadi',
    'Tukang Bangunan',
    'Aktif',
    'palipui'
  ),
  ('Mulyadi', 'Tukang Kayu', 'Aktif', 'palipui'),
  (
    'Hendra Gunawan',
    'Tukang Kayu',
    'Aktif',
    'makkaturang1'
  ),
  (
    'Fajar Pratama',
    'Tukang Listrik',
    'Aktif',
    'makkaturang1'
  ),
  (
    'Dedi Supriyadi',
    'Tukang Listrik',
    'Aktif',
    'palipui'
  ),
  (
    'Rizki Ramadhan',
    'Tukang Besi',
    'Aktif',
    'makkaturang1'
  ),
  (
    'Siti Rahayu',
    'Buruh Angkut',
    'Aktif',
    'palipui'
  ),
  (
    'Asep Saepudin',
    'Buruh Angkut',
    'Aktif',
    'makkaturang1'
  ),
  (
    'Roni Sastra',
    'Buruh Angkut',
    'Aktif',
    'palipui'
  ),
  (
    'Dodi Kurniawan',
    'Buruh Angkut',
    'Aktif',
    'makkaturang1'
  ),
  (
    'Dewi Lestari',
    'Buruh Bersih',
    'Cuti',
    'palipui'
  ),
  ('Maya Sari', 'Buruh Bersih', 'Aktif', 'palipui'),
  (
    'Linda Wati',
    'Buruh Bersih',
    'Aktif',
    'makkaturang1'
  ),
  ('Tono Suharto', 'Buruh Umum', 'Aktif', 'palipui'),
  (
    'Bambang Sutrisno',
    'Buruh Umum',
    'Aktif',
    'makkaturang1'
  ),
  (
    'Agus Salim',
    'Buruh Umum',
    'Libur',
    'makkaturang1'
  ),
  ('Rina Marlina', 'Buruh Umum', 'Resign', NULL);
INSERT INTO projects (
    id,
    code,
    name,
    description,
    start_at,
    due_at,
    budget
  )
VALUES (
    'p1',
    'PRJ-001',
    'Gedung A',
    'Pembangunan gedung 5 lantai',
    strftime('%s', 'now') * 1000,
    strftime('%s', 'now', '+90 day') * 1000,
    500000000
  );
INSERT INTO project_sites (id, project_id, name, lat, lng, radius_m)
VALUES ('s1', 'p1', 'Lokasi Utama', -6.200, 106.816, 100);
INSERT INTO workers (id, name, role, phone)
VALUES ('w1', 'Budi', 'Mandor', '08123'),
  ('w2', 'Siti', 'Tukang', '08124'),
  ('w3', 'Andi', 'Helper', '08125');
INSERT INTO material_master (id, sku, name, unit)
VALUES ('m1', 'MAT-001', 'Semen', 'zak'),
  ('m2', 'MAT-002', 'Pasir', 'm3'),
  ('m3', 'MAT-003', 'Besi Beton', 'batang');
INSERT INTO tasks (
    id,
    project_id,
    title,
    description,
    assignee_id,
    start_at,
    due_at,
    status,
    priority,
    progress
  )
VALUES (
    't1',
    'p1',
    'Pondasi',
    'Gali & cor pondasi',
    'w2',
    strftime('%s', 'now') * 1000,
    strftime('%s', 'now', '+14 day') * 1000,
    'DOING',
    'HIGH',
    50
  ),
  (
    't2',
    'p1',
    'Kolom & Balok',
    'Pasang tulangan',
    'w3',
    strftime('%s', 'now', '+15 day') * 1000,
    strftime('%s', 'now', '+45 day') * 1000,
    'TODO',
    'MEDIUM',
    0
  );
INSERT INTO milestones (id, project_id, name, at_date)
VALUES (
    'ms1',
    'p1',
    'Selesai Pondasi',
    strftime('%s', 'now', '+14 day') * 1000
  );
INSERT INTO attendance (
    id,
    worker_id,
    project_id,
    type,
    at_ts,
    lat,
    lng,
    accuracy,
    method
  )
VALUES (
    'a1',
    'w2',
    'p1',
    'CHECKIN',
    strftime('%s', 'now') * 1000,
    -6.200,
    106.816,
    15,
    'AUTO'
  );
INSERT INTO timesheets (
    worker_id,
    project_id,
    date,
    minutes_worked,
    overtime_minutes
  )
VALUES ('w2', 'p1', date('now'), '480', '60');
INSERT INTO material_ledger (
    id,
    material_id,
    ts,
    ref_type,
    ref_id,
    qty_delta,
    unit_cost,
    note
  )
VALUES (
    'ml1',
    'm1',
    strftime('%s', 'now') * 1000,
    'USAGE',
    't1',
    -10,
    50000,
    'Pondasi'
  ),
  (
    'ml2',
    'm2',
    strftime('%s', 'now') * 1000,
    'USAGE',
    't1',
    -5,
    20000,
    'Pondasi'
  );
INSERT INTO project_costs (
    id,
    project_id,
    ts,
    category,
    amount,
    ref_type,
    ref_id,
    note
  )
VALUES (
    'c1',
    'p1',
    strftime('%s', 'now') * 1000,
    'MATERIAL',
    500000,
    'LEDGER',
    'ml1',
    'Semen pondasi'
  ),
  (
    'c2',
    'p1',
    strftime('%s', 'now') * 1000,
    'LABOR',
    300000,
    'TIMESHEET',
    'w2',
    'Upah harian'
  );
COMMIT;