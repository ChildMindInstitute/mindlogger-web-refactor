import { flattenPaletteObject, hexToRgba } from './theme.utils';

type BasePalette = Record<string, Record<string | number, string>>;
export interface Palette {
  [key: string]: string;
}

/**
 * This references all base "primitive" colors.
 * These colors will be used to give values to
 * semantic colors, like "on_container".
 */
const basePalette: BasePalette = {
  primary: {
    // Main primary color falls under primary[3]
    // For the rest of the colors, the default value is [40]
    default: '#0B0907',
    0: '#000',
    10: '#1D1B19',
    20: '#32302D',
    30: '#484744',
    40: '#5F5E5B',
    50: '#787773',
    60: '#91918E',
    70: '#ACABA9',
    80: '#C6C6C5',
    90: '#E3E2E1',
    95: '#F1F0EF',
    99: '#FDFCFC',
    100: '#FFF',
  },
  secondary: {
    0: '#000',
    10: '#041847',
    20: '#182D65',
    30: '#173F9F',
    40: '#004CED',
    50: '#216DFF',
    60: '#3C90FF',
    70: '#55B1FF',
    80: '#8BCEFF',
    90: '#CAE6FF',
    95: '#E5F3FF',
    99: '#FBFCFF',
    100: '#FFF',
  },
  tertiary: {
    0: '#000',
    10: '#320F1D',
    20: '#4B2432',
    30: '#6B364A',
    40: '#944262',
    50: '#AF5C82',
    60: '#CA779E',
    70: '#D69AB8',
    80: '#E5BCD1',
    90: '#F0DAE5',
    95: '#F9EEF4',
    99: '#FFFBFF',
    100: '#FFF',
  },
  error: {
    0: '#000',
    10: '#410002',
    20: '#690004',
    30: '#930009',
    40: '#BA1A1A',
    50: '#DE3730',
    60: '#FF5449',
    70: '#FE897D',
    80: '#FFB4AB',
    90: '#FFDAD6',
    95: '#FFEDEA',
    99: '#FFFBFF',
    100: '#FFF',
  },
  neutral: {
    0: '#000',
    10: '#1D1B19',
    20: '#32302D',
    30: '#484744',
    40: '#5F5E5B',
    50: '#787773',
    60: '#91918E',
    70: '#ACABA9',
    80: '#C6C6C5',
    90: '#E3E2E1',
    95: '#F1F0EF',
    99: '#FDFCFC',
    100: '#FFF',
  },
  neutralVariant: {
    0: '#000',
    10: '#1D1B19',
    20: '#32302D',
    30: '#484744',
    40: '#5F5E5B',
    50: '#787773',
    60: '#91918E',
    70: '#ACABA9',
    80: '#C6C6C5',
    90: '#E3E2E1',
    95: '#F1F0EF',
    99: '#FDFCFC',
    100: '#FFF',
  },
  surface: {
    1: '#F5F4F4',
    2: '#F0EFEF',
    3: '#ECEBEA',
    4: '#EAE9E9',
    5: '#E7E6E5',
  },
  blue: {
    default: '#0152FD',
    light: '#B3CBFE',
  },
  brown: {
    default: '#79403C',
    light: '#D6C6C4',
  },
  gray: {
    default: '#787773',
    light: '#D6D6D5',
  },
  green: {
    default: '#386348',
    light: '#C3D0C8',
  },
  orange: {
    default: '#E65838',
    light: '#F7CDC3',
  },
  pink: {
    default: '#A75276',
    light: '#E6CCD7',
  },
  yellow: {
    default: '#DAB417',
    light: '#F4E8BA',
  },
  purple: {
    default: '#6C4E9B',
    light: '#D3CAE1',
  },
  red: {
    default: '#B83236',
    light: '#EAC1C3',
  },
};

/**
 * This contains all flattened palette colors with its tonal variants,
 * as well as all semantic colors (on_container, container, etc).
 */
export const semanticPalette: Palette = {
  ...flattenPaletteObject({ ...basePalette.primary }, 'primary'),
  onPrimary: basePalette.primary[100],
  primaryContainer: basePalette.primary[90],
  onPrimaryContainer: basePalette.primary[10],
  primaryFixed: basePalette.primary[90],
  onPrimaryFixed: basePalette.primary[10],
  primaryFixedDim: basePalette.primary[80],
  onPrimaryFixedVariant: basePalette.primary[30],

  ...flattenPaletteObject({ ...basePalette.secondary }, 'secondary'),
  onSecondary: basePalette.secondary[100],
  secondaryContainer: basePalette.secondary[90],
  onSecondaryContainer: basePalette.secondary[0],
  secondaryFixed: basePalette.secondary[90],
  onSecondaryFixed: basePalette.secondary[10],
  secondaryFixedDim: basePalette.secondary[80],
  onSecondaryFixedVariant: basePalette.secondary[30],

  ...flattenPaletteObject({ ...basePalette.tertiary }, 'tertiary'),
  onTertiary: basePalette.tertiary[100],
  tertiaryContainer: basePalette.tertiary[90],
  onTertiaryContainer: basePalette.tertiary[10],
  tertiaryFixed: basePalette.tertiary[90],
  onTertiaryFixed: basePalette.tertiary[10],
  tertiaryFixedDim: basePalette.tertiary[80],
  onTertiaryFixedVariant: basePalette.tertiary[30],

  ...flattenPaletteObject({ ...basePalette.error }, 'error'),
  onError: basePalette.error[100],
  errorContainer: basePalette.error[90],
  onErrorContainer: basePalette.error[10],

  ...flattenPaletteObject({ ...basePalette.neutral }, 'neutral'),
  ...flattenPaletteObject({ ...basePalette.neutral }, 'neutralVariant'),

  ...flattenPaletteObject({ ...basePalette.surface }, 'surface'),
  surface: basePalette.neutral[99],
  onSurface: basePalette.neutral[10],
  surfaceVariant: basePalette.neutralVariant[90],
  onSurfaceVariant: basePalette.neutralVariant[30],

  inverseSurface: basePalette.neutral[20],
  inverseOnSurface: basePalette.neutral[95],

  outline: basePalette.neutralVariant[50],
  outlineVariant: basePalette.neutralVariant[80],

  black: '#000',
  white: '#FFF',
  ...flattenPaletteObject({ ...basePalette.blue }, 'blue'),
  ...flattenPaletteObject({ ...basePalette.brown }, 'brown'),
  ...flattenPaletteObject({ ...basePalette.gray }, 'gray'),
  ...flattenPaletteObject({ ...basePalette.green }, 'green'),
  ...flattenPaletteObject({ ...basePalette.orange }, 'orange'),
  ...flattenPaletteObject({ ...basePalette.pink }, 'pink'),
  ...flattenPaletteObject({ ...basePalette.yellow }, 'yellow'),
  ...flattenPaletteObject({ ...basePalette.purple }, 'purple'),
  ...flattenPaletteObject({ ...basePalette.red }, 'red'),
};

/**
 * These are alpha variants of the semantic colors.
 * They exist separately from the semantic palette for
 * better maintainability.
 */
const alphaVariantsPalette: Palette = {
  primaryAlpha8: hexToRgba(semanticPalette.primary40, 0.08),
  primaryAlpha12: hexToRgba(semanticPalette.primary40, 0.12),
  primaryAlpha16: hexToRgba(semanticPalette.primary40, 0.16),
  onPrimaryAlpha8: hexToRgba(semanticPalette.onPrimary, 0.08),
  onPrimaryAlpha12: hexToRgba(semanticPalette.onPrimary, 0.12),
  onPrimaryContainerAlpha8: hexToRgba(semanticPalette.onPrimaryContainer, 0.08),

  onSecondaryContainerAlpha8: hexToRgba(semanticPalette.onSecondaryContainer, 0.08),
  onSecondaryContainerAlpha12: hexToRgba(semanticPalette.onSecondaryContainer, 0.12),

  onSurfaceAlpha8: hexToRgba(semanticPalette.onSurface, 0.08),
  onSurfaceAlpha12: hexToRgba(semanticPalette.onSurface, 0.12),
  onSurfaceAlpha16: hexToRgba(semanticPalette.onSurface, 0.16),
  onSurfaceAlpha38: hexToRgba(semanticPalette.onSurface, 0.38),
  surfaceVariantAlpha8: hexToRgba(semanticPalette.surfaceVariant, 0.08),
  onSurfaceVariantAlpha8: hexToRgba(semanticPalette.onSurfaceVariant, 0.08),
  onSurfaceVariantAlpha12: hexToRgba(semanticPalette.onSurfaceVariant, 0.12),
  onSurfaceVariantAlpha16: hexToRgba(semanticPalette.onSurfaceVariant, 0.16),

  outlineAlpha8: hexToRgba(semanticPalette.outline, 0.08),
  outlineAlpha12: hexToRgba(semanticPalette.outline, 0.12),

  disabled: hexToRgba(semanticPalette.onSurface, 0.38),

  whiteAlpha8: hexToRgba(semanticPalette.white, 0.08),
  whiteAlpha12: hexToRgba(semanticPalette.white, 0.12),
  whiteAlpha50: hexToRgba(semanticPalette.white, 0.5),
  blueAlpha30: hexToRgba(semanticPalette.blue, 0.3),
  brownAlpha30: hexToRgba(semanticPalette.brown, 0.3),
  grayAlpha30: hexToRgba(semanticPalette.gray, 0.3),
  greenAlpha30: hexToRgba(semanticPalette.green, 0.3),
  orangeAlpha30: hexToRgba(semanticPalette.orange, 0.3),
  pinkAlpha30: hexToRgba(semanticPalette.pink, 0.3),
  yellowAlpha30: hexToRgba(semanticPalette.yellow, 0.3),
  purpleAlpha30: hexToRgba(semanticPalette.purple, 0.3),
  redAlpha8: hexToRgba(semanticPalette.red, 0.08),
  redAlpha30: hexToRgba(semanticPalette.red, 0.3),
};

/**
 * This contains all colors, their tonal variants,
 * semantic colors (onContainer, container, etc), and alpha variants.
 */
export const palette: Palette = {
  ...semanticPalette,
  ...alphaVariantsPalette,
};
