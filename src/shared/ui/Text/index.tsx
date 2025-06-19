import React, { PropsWithChildren } from 'react';

import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// Original MUI variants for semantic HTML mapping
type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'subtitle1'
  | 'subtitle2'
  | 'caption'
  | 'button'
  | 'overline';

type ThemeTypographyVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleLargeBold'
  | 'titleLargish'
  | 'titleLargishBold'
  | 'titleMedium'
  | 'titleMediumBold'
  | 'titleSmall'
  | 'titleSmallBold'
  | 'labelLarge'
  | 'labelLargeBold'
  | 'labelMedium'
  | 'labelMediumBold'
  | 'labelSmall'
  | 'labelSmallBold'
  | 'bodyLarger'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'inherit';

const themeVariantMapping = {
  displayLarge: 'h1',
  displayMedium: 'h1',
  displaySmall: 'h1',
  headlineLarge: 'h2',
  headlineMedium: 'h2',
  headlineSmall: 'h3',
  titleLarge: 'h3',
  titleLargeBold: 'h3',
  titleLargish: 'h4',
  titleLargishBold: 'h4',
  titleMedium: 'h5',
  titleMediumBold: 'h5',
  titleSmall: 'h6',
  titleSmallBold: 'h6',
  labelLarge: 'span',
  labelLargeBold: 'span',
  labelMedium: 'span',
  labelMediumBold: 'span',
  labelSmall: 'span',
  labelSmallBold: 'span',
  bodyLarger: 'p',
  bodyLarge: 'p',
  bodyMedium: 'p',
  bodySmall: 'p',
};

type Props = PropsWithChildren<{
  variant?: TextVariant | ThemeTypographyVariant;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  padding?: string;
  margin?: string;
  sx?: SxProps<Theme>;
  testid?: string;
  gutterBottom?: boolean;
  lineHeight?: string;
  letterSpacing?: string;
  component?: React.ElementType;
  onClick?: () => void;
}>;

/**
 * Text component that wraps MUI Typography
 *
 * @preferred-usage Use the theme typography variants for consistent styling
 * @example <Text variant="bodyMedium">This text uses the bodyMedium style</Text>
 *
 * @seo-friendly Automatically maps typography variants to appropriate HTML elements
 * @example <Text variant="headlineLarge"> renders as <h2> for proper SEO
 *
 * @override-element You can override the HTML element with the component prop
 * @example <Text variant="bodyMedium" component="label">Custom element</Text>
 */
function Text({
  children,
  fontSize,
  fontWeight,
  color,
  padding,
  margin,
  sx,
  variant = 'bodyLarge',
  testid,
  gutterBottom,
  lineHeight,
  letterSpacing,
  onClick,
  component,
}: Props) {
  return (
    <Typography
      variant={variant}
      fontSize={fontSize}
      fontWeight={fontWeight}
      data-testid={testid}
      gutterBottom={gutterBottom}
      lineHeight={lineHeight}
      letterSpacing={letterSpacing}
      onClick={onClick}
      {...(component && { component })}
      variantMapping={themeVariantMapping}
      sx={{ color, padding, margin, ...sx }}
    >
      {children}
    </Typography>
  );
}

export default Text;
