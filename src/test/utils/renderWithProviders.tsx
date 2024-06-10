import { ReactNode } from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Route, Routes, MemoryRouter } from 'react-router-dom';

import { ExtendedRenderOptions, setupStore } from '~/app/store';

export const renderWithProviders = (
  ui: React.ReactElement,
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

  return { ...render(ui, { wrapper: Providers, ...options }), store };
};
