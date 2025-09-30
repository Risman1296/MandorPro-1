// Maintain backward-compatible types used by SectionScreen
export type SubTab = { id: string; label: string };
export type Tab = { id: string; label: string; subTabs?: SubTab[] };

// New explicit types per spec
export type NavTab = { id: string; label: string; route: string; subTabs?: { id: string; label: string }[] };
export type NavNode = { id: string; label: string; icon: string; route: string; tabs?: NavTab[] };

export const NAV_TREE: NavNode[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'grid-outline',
    route: '/dashboard',
    tabs: [],
  },
  {
    id: 'project',
    label: 'Projects',
    icon: 'layers-outline',
    route: '/project/management',
    tabs: [
      { id: 'management', label: 'Manajemen', route: '/project/management' },
      { id: 'tasks', label: 'Tasks', route: '/project/tasks' },
      { id: 'timeline', label: 'Timeline', route: '/project/timeline' },
    ],
  },
  {
    id: 'worker',
    label: 'Workers',
    icon: 'people-outline',
    route: '/worker/management',
    tabs: [
      { id: 'management', label: 'Manajemen', route: '/worker/management' },
    ],
  },
  {
    id: 'material',
    label: 'Materials',
    icon: 'cube-outline',
    route: '/material/management',
    tabs: [
      { id: 'stock', label: 'Stok', route: '/material/stock' },
      { id: 'usage', label: 'Pemakaian', route: '/material/usage' },
      { id: 'management', label: 'Manajemen', route: '/material/management' },
    ],
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: 'wallet-outline',
    route: '/payroll',
    tabs: [
      { id: 'management', label: 'Manajemen', route: '/payroll' },
    ],
  },
  {
    id: 'gaji',
    label: 'Gaji (Legacy)',
    icon: 'calendar-outline',
    route: '/gaji/weekly',
    tabs: [
      { id: 'weekly', label: 'Mingguan', route: '/gaji/weekly' },
    ],
  },
  {
    id: 'absensi',
    label: 'Absensi',
    icon: 'calendar-outline',
    route: '/absensi',
    tabs: [
      { id: 'harian', label: 'Harian', route: '/absensi' },
      { id: 'rekap', label: 'Rekap', route: '/absensi/rekap' },
    ],
  },
  {
    id: 'harian',
    label: 'Harian',
    icon: 'book-outline',
    route: '/harian/diary',
    tabs: [
      { id: 'diary', label: 'Diary', route: '/harian/diary' },
      { id: 'foto', label: 'Foto', route: '/harian/foto' },
    ],
  },
  {
    id: 'report',
    label: 'Report',
    icon: 'stats-chart-outline',
    route: '/report',
    tabs: [
      { id: 'daily', label: 'Harian', route: '/report/daily' },
      { id: 'monthly', label: 'Bulanan', route: '/report/monthly' },
    ],
  },
  {
    id: 'laporan',
    label: 'Laporan',
    icon: 'document-outline',
    route: '/laporan',
    tabs: [
      { id: 'export', label: 'Export', route: '/laporan/export' },
      { id: 'summary', label: 'Ringkasan', route: '/laporan/summary' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: 'settings-outline',
    route: '/admin',
    tabs: [
      { id: 'data', label: 'Data', route: '/admin/data' },
      { id: 'database', label: 'Database', route: '/admin/database' },
    ],
  },
];

export type NavTree = NavNode[];
export type SectionId = string;
export type TabId = string;
export type SubTabId = string;
