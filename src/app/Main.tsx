import { Suspense, StrictMode, lazy } from 'react';

import ReactDOM from 'react-dom/client';

import Loader from '~/shared/ui/Loader';

const LaunchDarklyProvider = lazy(() => import('./LaunchDarklyProvider'));

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <LaunchDarklyProvider />
    </Suspense>
  </StrictMode>,
);
