import { PropsWithChildren } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { typography } from '~/shared/constants/theme/typography';
import { variables } from '~/shared/constants/theme/variables';

type Props = PropsWithChildren<unknown>;

const theme = createTheme({
  palette: {
    primary: {
      main: variables.palette.primary,
    },
    secondary: {
      main: variables.palette.secondary,
    },
  },
  typography: {
    fontFamily: variables.font.family.body,
    htmlFontSize: 16,
    displayLarge: {
      fontFamily: variables.font.family.display,
      fontWeight: variables.font.weight.light,
      fontSize: variables.font.size.display1,
      lineHeight: variables.font.lineHeight.display1,
      letterSpacing: variables.font.letterSpacing.none,
    },
    displayMedium: {
      fontFamily: variables.font.family.display,
      fontWeight: variables.font.weight.light,
      fontSize: variables.font.size.display2,
      lineHeight: variables.font.lineHeight.display2,
      letterSpacing: variables.font.letterSpacing.none,
    },
    displaySmall: {
      fontFamily: variables.font.family.display,
      fontWeight: variables.font.weight.light,
      fontSize: variables.font.size.display3,
      lineHeight: variables.font.lineHeight.display3,
      letterSpacing: variables.font.letterSpacing.none,
    },
    headlineLarge: {
      fontFamily: variables.font.family.headline,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.headline1,
      lineHeight: variables.font.lineHeight.headline1,
      letterSpacing: variables.font.letterSpacing.none,
    },
    headlineMedium: {
      fontFamily: variables.font.family.headline,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.headline2,
      lineHeight: variables.font.lineHeight.headline2,
      letterSpacing: variables.font.letterSpacing.none,
    },
    headlineSmall: {
      fontFamily: variables.font.family.headline,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.headline3,
      lineHeight: variables.font.lineHeight.headline3,
      letterSpacing: variables.font.letterSpacing.none,
    },
    titleLarge: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.title1,
      lineHeight: variables.font.lineHeight.title1,
      letterSpacing: variables.font.letterSpacing.none,
    },
    titleLargeBold: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.bold,
      fontSize: variables.font.size.title1,
      lineHeight: variables.font.lineHeight.title1,
      letterSpacing: variables.font.letterSpacing.none,
    },
    titleLargish: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.title2,
      lineHeight: variables.font.lineHeight.title2,
      letterSpacing: variables.font.letterSpacing.none,
    },
    titleLargishBold: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.bold,
      fontSize: variables.font.size.title2,
      lineHeight: variables.font.lineHeight.title2,
      letterSpacing: variables.font.letterSpacing.none,
    },
    titleMedium: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.title3,
      lineHeight: variables.font.lineHeight.title3,
      letterSpacing: variables.font.letterSpacing.md,
    },
    titleMediumBold: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.bold,
      fontSize: variables.font.size.title3,
      lineHeight: variables.font.lineHeight.title3,
      letterSpacing: variables.font.letterSpacing.md,
    },
    titleSmall: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.title4,
      lineHeight: variables.font.lineHeight.title4,
      letterSpacing: variables.font.letterSpacing.sm,
    },
    titleSmallBold: {
      fontFamily: variables.font.family.title,
      fontWeight: variables.font.weight.bold,
      fontSize: variables.font.size.title4,
      lineHeight: variables.font.lineHeight.title4,
      letterSpacing: variables.font.letterSpacing.sm,
    },
    labelLarge: {
      fontFamily: variables.font.family.label,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.label1,
      lineHeight: variables.font.lineHeight.label1,
      letterSpacing: variables.font.letterSpacing.sm,
    },
    labelLargeBold: {
      fontFamily: variables.font.family.label,
      fontWeight: variables.font.weight.bold,
      fontSize: variables.font.size.label1,
      lineHeight: variables.font.lineHeight.label1,
      letterSpacing: variables.font.letterSpacing.sm,
    },
    labelMedium: {
      fontFamily: variables.font.family.label,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.label2,
      lineHeight: variables.font.lineHeight.label2,
      letterSpacing: variables.font.letterSpacing.xxl,
    },
    labelMediumBold: {
      fontFamily: variables.font.family.label,
      fontWeight: variables.font.weight.bold,
      fontSize: variables.font.size.label2,
      lineHeight: variables.font.lineHeight.label2,
      letterSpacing: variables.font.letterSpacing.xxl,
    },
    labelSmall: {
      fontFamily: variables.font.family.label,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.label3,
      lineHeight: variables.font.lineHeight.label3,
      letterSpacing: variables.font.letterSpacing.xxl,
    },
    labelSmallBold: {
      fontFamily: variables.font.family.label,
      fontWeight: variables.font.weight.bold,
      fontSize: variables.font.size.label3,
      lineHeight: variables.font.lineHeight.label3,
      letterSpacing: variables.font.letterSpacing.xxl,
    },
    bodyLarger: {
      fontFamily: variables.font.family.body,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.body1,
      lineHeight: variables.font.lineHeight.body1,
      letterSpacing: variables.font.letterSpacing.md,
    },
    bodyLarge: {
      fontFamily: variables.font.family.body,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.body2,
      lineHeight: variables.font.lineHeight.body2,
      letterSpacing: variables.font.letterSpacing.md,
    },
    bodyMedium: {
      fontFamily: variables.font.family.body,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.body3,
      lineHeight: variables.font.lineHeight.body3,
      letterSpacing: variables.font.letterSpacing.lg,
    },
    bodySmall: {
      fontFamily: variables.font.family.body,
      fontWeight: variables.font.weight.regular,
      fontSize: variables.font.size.body4,
      lineHeight: variables.font.lineHeight.body4,
      letterSpacing: variables.font.letterSpacing.xl,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: () => ({
        typography,
        'html, body, #root': {
          height: '100svh',
          width: '100%',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '#root': {
          display: 'flex',
        },
        a: {
          textDecoration: 'none',
          color: variables.palette.secondary,
        },
        p: {
          margin: 0,
          padding: 0,
        },
        '.outline-none': {
          outline: 'none !important',
          boxShadow: 'none !important',
        },
        '.border-none': {
          border: 'none !important',
        },
        '.disable-default-style': {
          border: 'none',
          outline: 'none',
          background: 'none',
          padding: 'none',
          margin: 'none',
        },
        '.color-white': {
          color: variables.palette.white,
        },
        '.color-white:hover': {
          color: variables.palette.white,
        },
        '.hover': {
          transition: '0.2s',
        },
        '.hover:hover': {
          cursor: 'pointer',
          boxShadow: '0 0px 2px 0 rgba(0, 0, 0, 0.1), 0 6px 15px 0 rgba(0, 0, 0, 0.16)',
        },
        'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
          {
            boxShadow: 'inset 0 0 30px 30px rgba(255, 255, 255, 1)',
          },
      }),
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState: { variant, severity } }) => ({
          color: variables.palette.onSurface,
          padding: theme.spacing(1.2, 1.6),
          borderRadius: 0,
          alignItems: 'center',
          ...(variant === 'standard' && {
            ...(severity === 'info' && {
              backgroundColor: variables.palette.blueAlpha30,
            }),
            ...(severity === 'success' && {
              backgroundColor: variables.palette.greenAlpha30,
            }),
            ...(severity === 'warning' && {
              backgroundColor: variables.palette.yellowAlpha30,
            }),
            ...(severity === 'error' && {
              backgroundColor: variables.palette.error90,
            }),
          }),
          '.MuiAlert-action': {
            marginLeft: 0,
            marginRight: 0,
            paddingTop: 0,
            alignItems: 'center',
          },
          '.MuiAlert-icon': {
            marginLeft: 'auto',
            opacity: 1,
          },
          '.MuiAlert-message': {
            padding: 0,
            maxWidth: theme.spacing(80),
            marginRight: 'auto',
          },
          a: {
            textDecoration: 'underline',
            '&:hover': {
              textDecoration: 'none',
            },
          },
          '.MuiButton-root': {
            padding: theme.spacing(1),
            margin: theme.spacing(0.4),
          },
          '.MuiButton-text:hover': {
            backgroundColor: variables.palette.onSurfaceAlpha8,
          },
        }),
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            fontWeight: variables.font.weight.bold,
            color: variables.palette.onPrimary,
            backgroundColor: variables.palette.primary,

            '&.Mui-disabled': {
              backgroundColor: variables.palette.onSurfaceAlpha12,
              color: variables.palette.disabled,
            },

            '&:not(.Mui-disabled)': {
              '&:hover': {
                background: `linear-gradient(${variables.palette.onPrimaryAlpha8}, ${variables.palette.onPrimaryAlpha8}), ${variables.palette.primary}`,
              },

              '&:focus, &:active': {
                background: `linear-gradient(${variables.palette.onPrimaryAlpha12}, ${variables.palette.onPrimaryAlpha12}), ${variables.palette.primary}`,
              },
            },
          },
        },
        {
          props: { variant: 'outlined' },
          style: {
            fontWeight: variables.font.weight.regular,
            backgroundColor: 'transparent',
            color: variables.palette.primary,
            border: `${variables.borderWidth.md} solid ${variables.palette.outlineVariant}`,

            '&.Mui-disabled': {
              borderColor: variables.palette.onSurfaceAlpha12,
              color: variables.palette.disabled,
            },

            '&:not(.Mui-disabled)': {
              '&:hover': {
                backgroundColor: variables.palette.primaryAlpha8,
              },

              '&:focus, &:active': {
                backgroundColor: variables.palette.primaryAlpha12,
              },

              '&:focus': {
                borderColor: variables.palette.primary,
              },
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            backgroundColor: 'transparent',
            fontWeight: variables.font.weight.regular,

            '&.Mui-disabled': {
              color: variables.palette.disabled,
            },

            '&:not(.MuiButton-textError):not(.Mui-disabled)': {
              color: variables.palette.primary,

              '&:hover': {
                backgroundColor: variables.palette.primaryAlpha8,
              },

              '&:focus, &:active': {
                backgroundColor: variables.palette.primaryAlpha12,
              },
            },
          },
        },
        {
          props: { variant: 'elevated' },
          style: {
            fontWeight: variables.font.weight.bold,
            backgroundColor: variables.palette.surface1,
            color: variables.palette.primary,
            boxShadow: variables.boxShadow.light1,

            '&.Mui-disabled': {
              backgroundColor: variables.palette.onSurfaceAlpha12,
              color: variables.palette.disabled,
            },

            '&:not(.Mui-disabled)': {
              '&:hover': {
                background: `linear-gradient(${variables.palette.primaryAlpha8}, ${variables.palette.primaryAlpha8}), ${variables.palette.surface1}`,
                boxShadow: variables.boxShadow.light2,
              },

              '&:focus, &:active': {
                background: `linear-gradient(${variables.palette.surface1Alpha12}, ${variables.palette.surface1Alpha12}), ${variables.palette.surface1}`,
              },
            },
          },
        },
        {
          props: { variant: 'tonal' },
          style: {
            fontWeight: variables.font.weight.regular,
            background: variables.palette.secondaryContainer,
            color: variables.palette.onSecondaryContainer,

            '&.Mui-disabled': {
              backgroundColor: variables.palette.onSurfaceAlpha12,
              color: variables.palette.disabled,
            },

            '&:not(.Mui-disabled)': {
              '&:hover, &:focus, &:active': {
                background: `linear-gradient(${variables.palette.onSurfaceVariantAlpha8}, ${variables.palette.onSurfaceVariantAlpha8}), ${variables.palette.secondaryContainer}`,
              },

              '&:hover': {
                boxShadow: variables.boxShadow.light1,
              },
            },
          },
        },
        {
          props: { variant: 'textNeutral' },
          style: {
            fontWeight: variables.font.weight.regular,
            background: 'transparent',
            color: variables.palette.onSurfaceVariant,

            '&.Mui-disabled': {
              color: variables.palette.disabled,
            },

            '&:not(.Mui-disabled)': {
              '&:hover': {
                backgroundColor: variables.palette.onSurfaceVariantAlpha8,
              },

              '&:focus, &:active': {
                backgroundColor: variables.palette.onSurfaceVariantAlpha12,
              },
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: variables.borderRadius.xxxl,
          boxShadow: 'none',
          fontSize: variables.font.size.title3,
          lineHeight: variables.font.lineHeight.title3,
          letterSpacing: variables.font.letterSpacing.md,
          height: '48px',
          minWidth: '100px',
          padding: '12px 24px',
          textTransform: 'none',
          gap: '8px',

          '& svg:not([fill])': {
            fill: 'currentColor',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: variables.boxShadow.light2,
        },
        list: {
          backgroundColor: variables.palette.surface1,
          padding: '8px 4px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: variables.palette.surfaceVariant,
          },
        },
      },
    },
  },
});

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    elevated: true;
    tonal: true;
    textNeutral: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    // Display variants - Affix Light
    displayLarge: React.CSSProperties;
    displayMedium: React.CSSProperties;
    displaySmall: React.CSSProperties;

    // Headline variants - Moderat Regular
    headlineLarge: React.CSSProperties;
    headlineMedium: React.CSSProperties;
    headlineSmall: React.CSSProperties;

    // Title variants - Moderat Regular & Bold
    titleLarge: React.CSSProperties;
    titleLargeBold: React.CSSProperties;
    titleLargish: React.CSSProperties;
    titleLargishBold: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleMediumBold: React.CSSProperties;
    titleSmall: React.CSSProperties;
    titleSmallBold: React.CSSProperties;

    // Label variants - Moderat Regular & Bold
    labelLarge: React.CSSProperties;
    labelLargeBold: React.CSSProperties;
    labelMedium: React.CSSProperties;
    labelMediumBold: React.CSSProperties;
    labelSmall: React.CSSProperties;
    labelSmallBold: React.CSSProperties;

    // Body variants - Moderat Regular
    bodyLarger: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodySmall: React.CSSProperties;
  }

  // Allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    // Display variants - Affix Light
    displayLarge?: React.CSSProperties;
    displayMedium?: React.CSSProperties;
    displaySmall?: React.CSSProperties;

    // Headline variants - Moderat Regular
    headlineLarge?: React.CSSProperties;
    headlineMedium?: React.CSSProperties;
    headlineSmall?: React.CSSProperties;

    // Title variants - Moderat Regular & Bold
    titleLarge?: React.CSSProperties;
    titleLargeBold?: React.CSSProperties;
    titleLargish?: React.CSSProperties;
    titleLargishBold?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    titleMediumBold?: React.CSSProperties;
    titleSmall?: React.CSSProperties;
    titleSmallBold?: React.CSSProperties;

    // Label variants - Moderat Regular & Bold
    labelLarge?: React.CSSProperties;
    labelLargeBold?: React.CSSProperties;
    labelMedium?: React.CSSProperties;
    labelMediumBold?: React.CSSProperties;
    labelSmall?: React.CSSProperties;
    labelSmallBold?: React.CSSProperties;

    // Body variants - Moderat Regular
    bodyLarger?: React.CSSProperties;
    bodyLarge?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    bodySmall?: React.CSSProperties;
  }
}

// Update the Typography component props
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    // Display variants - Affix Light
    displayLarge: true;
    displayMedium: true;
    displaySmall: true;

    // Headline variants - Moderat Regular
    headlineLarge: true;
    headlineMedium: true;
    headlineSmall: true;

    // Title variants - Moderat Regular & Bold
    titleLarge: true;
    titleLargeBold: true;
    titleLargish: true;
    titleLargishBold: true;
    titleMedium: true;
    titleMediumBold: true;
    titleSmall: true;
    titleSmallBold: true;

    // Label variants - Moderat Regular & Bold
    labelLarge: true;
    labelLargeBold: true;
    labelMedium: true;
    labelMediumBold: true;
    labelSmall: true;
    labelSmallBold: true;

    // Body variants - Moderat Regular
    bodyLarger: true;
    bodyLarge: true;
    bodyMedium: true;
    bodySmall: true;
  }
}

function MUIThemeProvider({ children }: Props) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default MUIThemeProvider;
