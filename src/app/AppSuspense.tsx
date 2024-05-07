import { Suspense, lazy } from 'react';

import { withLDProvider } from 'launchdarkly-react-client-sdk';

const App = lazy(() => import('./App'));

import Loader from '~/shared/ui/Loader';

function AppSuspense() {
  return (
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
  );
}

export default withLDProvider({
  clientSideID: import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID,
})(AppSuspense);
