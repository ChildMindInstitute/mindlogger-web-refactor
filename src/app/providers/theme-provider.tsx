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
});

function MUIThemeProvider({ children }: Props) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default MUIThemeProvider;
