import { combineReducers, configureStore, EmptyObject } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import { PersistConfig } from "redux-persist/es/types"
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2"
import storage from "redux-persist/lib/storage"

const persistConfig: PersistConfig<EmptyObject> = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
}

function createRootReducer() {
  const rootReducer = combineReducers({})
  return rootReducer
}

function createApplicationStore() {
  const rootReducer = createRootReducer()

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: { ignoreActions: true },
      }),
    devTools: process.env.NODE_ENV !== "production",
  })

  return {
    ...store,
  }
}

const store = createApplicationStore()

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)

export default store
