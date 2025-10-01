// 📁 src/constants/Theme.ts
export const ConstructionTheme = {
  colors: {
    primary: '#2D5BFF',       // Biru profesional
    secondary: '#00C896',     // Hijau progress
    accent: '#FF6B35',        // Oranye warning
    danger: '#FF4757',        // Merah error
    warning: '#FFA502',       // Kuning peringatan
    success: '#2ED573',       // Hijau success
    dark: '#2F3542',          // Dark text
    medium: '#747D8C',        // Medium text
    light: '#A4B0BE',         // Light text
    background: '#F8F9FA',    // Background utama
    surface: '#FFFFFF',       // Surface cards
    border: '#E8ECF0',        // Border lines
  },
  typography: {
    h1: { fontSize: 28, fontWeight: 'bold' as const, lineHeight: 36 },
    h2: { fontSize: 24, fontWeight: 'bold' as const, lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: 'normal' as const, lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: 'normal' as const, lineHeight: 20 },
    small: { fontSize: 12, fontWeight: 'normal' as const, lineHeight: 16 },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
  }
};

export type ThemeColors = keyof typeof ConstructionTheme.colors;
export type ThemeSpacing = keyof typeof ConstructionTheme.spacing;
export type ThemeBorderRadius = keyof typeof ConstructionTheme.borderRadius;
