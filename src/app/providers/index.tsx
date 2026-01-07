import { PropsWithChildren } from 'react';

import CssBaseline from '@mui/material/CssBaseline';

import DateLocalizationProvider from './date-localization-provider';
import ReactQuery from './react-query';
import ReduxProvider from './redux';
import RouteProvider from './route-provider';
import MUIThemeProvider from './theme-provider';

import { MFAProvider } from '~/features/Login/lib/MFAContext';

type Props = PropsWithChildren<unknown>;

function Providers({ children }: Props) {
  return (
    <>
      <CssBaseline />
      <MUIThemeProvider>
        <RouteProvider>
          {/* MFAProvider: Isolates MFA state (token, password) from auth flow.
              Password kept in memory only for encryption key derivation after MFA success.
              we can remove this when we update the api to return USER_ID */}
          <MFAProvider>
            <ReduxProvider>
              <ReactQuery>
                <DateLocalizationProvider>{children}</DateLocalizationProvider>
              </ReactQuery>
            </ReduxProvider>
          </MFAProvider>
        </RouteProvider>
      </MUIThemeProvider>
    </>
  );
}

export default Providers;
