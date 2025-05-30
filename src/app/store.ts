import { combineReducers, configureStore, PreloadedState, Reducer } from '@reduxjs/toolkit';
import { RenderOptions } from '@testing-library/react';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/lib/storage';
import sessionStorage from 'redux-persist/lib/storage/session';

import { appletModel } from '~/entities/applet';
import { bannerModel } from '~/entities/banner';
import { BannersStore } from '~/entities/banner/model';
import { defaultBannersModel } from '~/entities/defaultBanners';
import { userModel } from '~/entities/user';
import { AutoCompletionModel } from '~/features/AutoCompletion';
import { RootState } from '~/shared/utils';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['banners'],
};

const bannerPersistConfig = {
  key: 'banners',
  storage: sessionStorage,
};

export const rootReducer = combineReducers({
  user: userModel.reducer,
  applets: appletModel.reducer,
  banners: persistReducer(
    bannerPersistConfig,
    bannerModel.reducer,
  ) as unknown as Reducer<BannersStore>,
  defaultBanners: defaultBannersModel.reducer,
  autoCompletion: AutoCompletionModel.reducer,
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
