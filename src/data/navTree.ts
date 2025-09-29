// Maintain backward-compatible types used by SectionScreen
export type SubTab = { id: string; label: string };
export type Tab = { id: string; label: string; subTabs?: SubTab[] };

// New explicit types per spec
export type NavTab = { id: string; label: string; subTabs?: { id: string; label: string }[] };
export type NavNode = { id: string; label: string; icon: string; path: string; tabs?: NavTab[] };

export const NAV_TREE: NavNode[] = [
  // UI baru
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'layout-dashboard',
    path: '/dashboard',
    tabs: [
      { id: 'overview', label: 'Ringkasan' },
      {
        id: 'reports',
        label: 'Laporan',
        subTabs: [
          { id: 'daily', label: 'Harian' },
          { id: 'monthly', label: 'Bulanan' },
        ],
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    path: '/settings',
    tabs: [
      { id: 'profile', label: 'Profil' },
      { id: 'billing', label: 'Billing' },
    ],
  },

  // Section lain yang ada di repo
  {
    id: 'project',
    label: 'Proyek',
    icon: 'folder-kanban',
    path: '/project',
    tabs: [{ id: 'management', label: 'Manajemen' }],
  },
  {
    id: 'worker',
    label: 'Pekerja',
    icon: 'users',
    path: '/worker',
    tabs: [{ id: 'management', label: 'Manajemen' }],
  },
  {
    id: 'material',
    label: 'Material',
    icon: 'package',
    path: '/material',
    tabs: [
      { id: 'stock', label: 'Stok' },
      { id: 'usage', label: 'Pemakaian' },
    ],
  },
  {
    id: 'payroll',
    label: 'Gaji',
    icon: 'wallet',
    path: '/payroll',
    tabs: [{ id: 'management', label: 'Manajemen' }],
  },
  {
    id: 'gaji',
    label: 'Gaji (Legacy)',
    icon: 'calendar-number',
    path: '/gaji',
    tabs: [{ id: 'weekly', label: 'Mingguan' }],
  },
  { id: 'absensi', label: 'Absensi', icon: 'calendar-check', path: '/absensi' },
  {
    id: 'harian',
    label: 'Harian',
    icon: 'notebook',
    path: '/harian',
    tabs: [{ id: 'diary', label: 'Diary' }],
  },
  {
    id: 'report',
    label: 'Report',
    icon: 'file-text',
    path: '/report',
    tabs: [{ id: 'daily', label: 'Harian' }],
  },
  {
    id: 'laporan',
    label: 'Laporan',
    icon: 'file-chart',
    path: '/laporan',
    tabs: [{ id: 'export', label: 'Export' }],
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: 'shield',
    path: '/admin',
    tabs: [{ id: 'data', label: 'Data' }],
  },
];

export type NavTree = NavNode[];
export type SectionId = string;
export type TabId = string;
export type SubTabId = string;
