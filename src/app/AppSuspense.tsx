import { Suspense, lazy } from 'react';

const App = lazy(() => import('./App'));

import Loader from '~/shared/ui/Loader';

function AppSuspense() {
  return (
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
  );
}

export default AppSuspense;
