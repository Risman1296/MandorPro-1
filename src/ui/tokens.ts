// ---- Color tokens (for Sidebar and UI) ----
export const colors = {
  // Base
  background: '#0B0F14',
  surface:    '#111827',
  border:     '#1F2937',
  text:       '#E5E7EB',
  muted:      '#9CA3AF',

  // Sidebar
  sidebarBg:      '#0F172A',
  sidebarHover:   '#1E293B',
  sidebarActive:  '#334155',
  sidebarActiveText: '#FFFFFF',

  // Semantic
  primary:  '#3B82F6',
  success:  '#10B981',
  warning:  '#F59E0B',
  danger:   '#EF4444',

  // --- Back-compat aliases used by Sidebar.tsx ---
  // Ikon & teks redup
  iconMuted:     '#9CA3AF', // alias muted
  textMuted:     '#9CA3AF', // alias muted
  textSecondary: '#CBD5E1',
  // Border / divider variasi
  borderStrong:  '#374151',
  divider:       '#1F2937', // alias border
  // Lainnya
  page:          '#0B0F14', // alias background
  primaryOn:     '#FFFFFF', // teks di atas primary
  primarySoft:   '#1E3A8A', // varian lembut primary (darken)
  accent:        '#3B82F6', // sementara samakan ke primary
} as const;

export type ColorName = keyof typeof colors;

// (Optional) keep default export for compatibility
const tokens = { colors };
export default tokens;
import { Dimensions } from 'react-native';

export const spacing = Object.freeze({
  xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32,
});

export const radius = Object.freeze({ sm: 8, md: 12, lg: 16, pill: 999 });

export const typography = Object.freeze({
  display: { size: 32, lh: 40, weight: '700' as const },
  headline: { size: 24, lh: 32, weight: '700' as const },
  title: { size: 20, lh: 28, weight: '600' as const },
  body: { size: 16, lh: 22, weight: '400' as const },
  label: { size: 14, lh: 18, weight: '500' as const },
});

export const touch = Object.freeze({ min: 48 });

export const sidebar = Object.freeze({
  railWidth: 72,
  drawerWidth: 280,
  itemHeight: 56,
  scrimOpacity: 0.32,
});

export const bars = Object.freeze({
  appbarHeight: 56,
  tabbarHeight: 48,
});

export const icons = Object.freeze({ default: 24, large: 32 });

export function layout() {
  const w = Dimensions.get('window').width;
  return {
    isCompact: w < 360,
    contentPadding: w >= 400 ? spacing.lg : spacing.md,
  };
}

export const fill = Object.freeze({ flex: 1, minWidth: 0, minHeight: 0 });
