import { ReactNode } from 'react';

import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { ExtendedRenderOptions, setupStore } from '~/app/store';

export const renderHookWithProviders = (
  hook: () => unknown,
  {
    route = '/',
    routePath = '/',
    preloadedState = {},
    store = setupStore(preloadedState),
    ...options
  }: ExtendedRenderOptions = {},
) => {
  const Providers = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={routePath} element={children} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  return { ...renderHook(hook, { wrapper: Providers, ...options }), store };
};
