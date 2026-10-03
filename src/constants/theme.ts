import { Platform } from 'react-native';

/** San Genotype brand palette. */
export const Palette = {
  primary: '#0F5C5E',
  primaryDark: '#083F41',
  background: '#F8F7F2',
  surface: '#FFFFFF',
  green: '#4CAF78',
  greenSoft: '#E3F2E8',
  text: '#172324',
  textSecondary: '#647174',
  warning: '#E6A23C',
  error: '#C94C4C',
  border: '#E6E8E2',
} as const;

/** Light and dark semantic colors used by the existing themed components. */
export const Colors = {
  light: {
    text: Palette.text,
    background: Palette.background,
    backgroundElement: Palette.surface,
    backgroundSelected: Palette.greenSoft,
    textSecondary: Palette.textSecondary,
    primary: Palette.primary,
    primaryDark: Palette.primaryDark,
    green: Palette.green,
    warning: Palette.warning,
    error: Palette.error,
  },
  dark: {
    text: '#F3F5F1',
    background: '#111B1C',
    backgroundElement: '#1B292A',
    backgroundSelected: '#203B36',
    textSecondary: '#B2BFBE',
    primary: '#69B9B5',
    primaryDark: '#A7D8D3',
    green: '#72C991',
    warning: '#F1B95D',
    error: '#EA7777',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

// Use native system sans fonts. Android's system font fallback covers Hausa
// letters such as ƙ, ɗ, and ɓ without bundling another font dependency.
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    rounded: 'system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, monospace',
  },
});

export const Typography = {
  display: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
  heading: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  subheading: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const },
  caption: { fontSize: 12, lineHeight: 18, fontWeight: '400' as const },
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
  nine: 48,
} as const;

export const Radius = {
  small: 12,
  card: 18,
  large: 24,
  pill: 999,
} as const;

export const Shadows = {
  card: Platform.select({
    android: { elevation: 2 },
    ios: {
      shadowColor: '#172324',
      shadowOpacity: 0.07,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    },
    default: {},
  }),
} as const;

export const ButtonStyles = {
  primary: { backgroundColor: Palette.primary, textColor: '#FFFFFF' },
  secondary: { backgroundColor: Palette.greenSoft, textColor: Palette.primaryDark },
  outline: { backgroundColor: 'transparent', textColor: Palette.primary },
} as const;

export const CardStyles = {
  backgroundColor: Palette.surface,
  borderRadius: Radius.card,
  padding: Spacing.six,
  ...Shadows.card,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
