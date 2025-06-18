import { PropsWithChildren } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { Theme } from '~/shared/constants';

type Props = PropsWithChildren<unknown>;

const theme = createTheme({
  palette: {
    primary: {
      main: Theme.colors.light.primary,
    },
    secondary: {
      main: Theme.colors.light.secondary,
    },
  },
  typography: {
    fontFamily: '"Lato", "Moderat", sans-serif',
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState: { variant, severity } }) => ({
          color: Theme.colors.light.onSurface,
          padding: theme.spacing(1.2, 1.6),
          borderRadius: 0,
          alignItems: 'center',
          ...(variant === 'standard' && {
            ...(severity === 'info' && {
              backgroundColor: Theme.colors.light.accentBlue30,
            }),
            ...(severity === 'success' && {
              backgroundColor: Theme.colors.light.accentGreen30,
            }),
            ...(severity === 'warning' && {
              backgroundColor: Theme.colors.light.accentYellow30,
            }),
            ...(severity === 'error' && {
              backgroundColor: Theme.colors.light.errorVariant,
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
            backgroundColor: Theme.colors.light.onSurfaceOpacity008,
          },
        }),
      },
    },
  },
});

function MUIThemeProvider({ children }: Props) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default MUIThemeProvider;
