import { Suspense, StrictMode, lazy } from 'react';

import ReactDOM from 'react-dom/client';

import { clearStaleSession } from './model';

import Loader from '~/shared/ui/Loader';

const LaunchDarklyProvider = lazy(() => import('./LaunchDarklyProvider'));

// Awaited ahead of the store, which is built inside the lazy chunk below. redux-persist reads local
// storage as it comes up, so a dead session has to be gone before then or it is restored into
// memory. The await is for the revoke call, which needs the tokens the clear is about to take.
void clearStaleSession().finally(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
      <Suspense fallback={<Loader style={{ position: 'fixed', left: 0, top: 0 }} />}>
        <LaunchDarklyProvider />
      </Suspense>
    </StrictMode>,
  );
});
