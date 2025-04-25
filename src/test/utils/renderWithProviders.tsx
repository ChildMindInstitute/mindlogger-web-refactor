import { ReactNode } from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Route, Routes, MemoryRouter } from 'react-router-dom';

import { ExtendedRenderOptions, setupStore } from '~/app/store';

// Extended options for renderWithProviders
type RenderWithProvidersOptions = ExtendedRenderOptions & {
  disableRouter?: boolean;
  mockDispatch?: ReturnType<typeof setupStore>['dispatch'];
};

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    route = '/',
    routePath = '/',
    preloadedState = {},
    store = setupStore(preloadedState),
    disableRouter,
    mockDispatch,
    ...options
  }: RenderWithProvidersOptions,
) => {
  // Replace dispatch with mock if provided
  if (mockDispatch) {
    store.dispatch = mockDispatch;
  }

  const Providers = ({ children }: { children: ReactNode }) => {
    // Wrap with Redux Provider always
    const reduxProvider = <Provider store={store}>{children}</Provider>;

    // Optionally wrap with router
    if (!disableRouter) {
      return (
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={routePath} element={reduxProvider} />
          </Routes>
        </MemoryRouter>
      );
    }

    return reduxProvider;
  };

  return { ...render(ui, { wrapper: Providers, ...options }), store };
};
