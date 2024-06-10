import { PreloadedState, combineReducers, configureStore } from '@reduxjs/toolkit';
import { RenderOptions } from '@testing-library/react';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/lib/storage';

import { appletModel } from '~/entities/applet';
import { bannerModel } from '~/entities/banner';
import { userModel } from '~/entities/user';
import { RootState } from '~/shared/utils';

const persistConfig = {
  key: 'root',
  storage,
};

export const rootReducer = combineReducers({
  user: userModel.reducer,
  applets: appletModel.reducer,
  banners: bannerModel.reducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    preloadedState,
  });

const store = setupStore();

export const persistor = persistStore(store);

export type ExtendedRenderOptions = Omit<RenderOptions, 'queries'> & {
  preloadedState?: PreloadedState<RootState>;
  store?: typeof store;
  route?: string;
  routePath?: string;
};

export default store;
