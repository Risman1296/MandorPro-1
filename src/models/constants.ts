// WBS Template for T-36 unit type with weights and piecework amounts
export const WBS_SEED_T36 = [
  { code: 'GAL', name: 'Galian Tanah', weight_pct: 1.88, piecework_total: 320000, uom: 'm3', qty_total: 1 },
  { code: 'PDK', name: 'Pondasi Batu Kali', weight_pct: 4.00, piecework_total: 680000, uom: 'm3', qty_total: 1 },
  { code: 'SLO', name: 'Pembesian & Beton Sloef', weight_pct: 4.71, piecework_total: 800000, uom: 'm1', qty_total: 1 },
  { code: 'URG', name: 'Tanah Urug', weight_pct: 1.18, piecework_total: 200000, uom: 'm3', qty_total: 1 },
  { code: 'KSN', name: 'Pemasangan Kusen', weight_pct: 2.35, piecework_total: 400000, uom: 'set', qty_total: 1 },
  { code: 'KOL', name: 'Pembesian & Beton Kolom', weight_pct: 4.71, piecework_total: 800000, uom: 'm1', qty_total: 1 },
  { code: 'BAT', name: 'Pasangan Batu Bata', weight_pct: 13.53, piecework_total: 2300000, uom: 'm2', qty_total: 1 },
  { code: 'RBL', name: 'Pembesian & Beton Ringbalk', weight_pct: 5.88, piecework_total: 1000000, uom: 'm1', qty_total: 1 },
  { code: 'PLT', name: 'Plat Beton / Kuda2 Batu', weight_pct: 2.94, piecework_total: 500000, uom: 'm2', qty_total: 1 },
  { code: 'PLT2', name: 'Plasteran', weight_pct: 8.82, piecework_total: 1500000, uom: 'm2', qty_total: 1 },
  { code: 'ATP', name: 'Rangka & Pemasangan Atap', weight_pct: 8.82, piecework_total: 1500000, uom: 'm2', qty_total: 1 },
  { code: 'LST', name: 'Instalasi Listrik', weight_pct: 2.94, piecework_total: 500000, uom: 'titik', qty_total: 1 },
  { code: 'PLF', name: 'Rangka & Pemasangan Plafon', weight_pct: 5.88, piecework_total: 1000000, uom: 'm2', qty_total: 1 },
  { code: 'SAN', name: 'Pemasangan Pipa Sanitasi', weight_pct: 2.06, piecework_total: 350000, uom: 'titik', qty_total: 1 },
  { code: 'LKR', name: 'Lantai Keramik, WC & Closed', weight_pct: 9.71, piecework_total: 1650000, uom: 'm2', qty_total: 1 },
  { code: 'ACI', name: 'Acian (Dinding, Plafon dll)', weight_pct: 5.88, piecework_total: 1000000, uom: 'm2', qty_total: 1 },
  { code: 'CAT', name: 'Pengecatan', weight_pct: 5.88, piecework_total: 1000000, uom: 'm2', qty_total: 1 },
  { code: 'DRN', name: 'Drainase', weight_pct: 2.94, piecework_total: 500000, uom: 'm1', qty_total: 1 },
  { code: 'PRP', name: 'Pemeliharaan / Perapihan', weight_pct: 5.88, piecework_total: 1000000, uom: 'ls', qty_total: 1 },
];

// Worker skills/roles
export const WORKER_SKILLS = [
  'Tukang Batu',
  'Tukang Kayu',
  'Tukang Besi',
  'Tukang Cat',
  'Tukang Listrik',
  'Tukang Pipa',
  'Buruh Harian',
  'Operator Alat',
  'Mandor',
  'Kepala Tukang'
];

// Material categories
export const MATERIAL_CATEGORIES = [
  'Semen',
  'Batu Bata',
  'Pasir',
  'Kerikil',
  'Besi Beton',
  'Kayu',
  'Atap',
  'Cat',
  'Keramik',
  'Pipa',
  'Listrik'
];

// Status colors for progress tracking
export const STATUS_COLORS = {
  not_started: '#f3f4f6',
  in_progress: '#fbbf24',
  completed: '#10b981',
  on_hold: '#f59e0b',
  delayed: '#ef4444'
};

// Project phases
export const PROJECT_PHASES = [
  'Persiapan',
  'Pondasi',
  'Struktur',
  'Dinding',
  'Atap',
  'Finishing',
  'Serah Terima'
];