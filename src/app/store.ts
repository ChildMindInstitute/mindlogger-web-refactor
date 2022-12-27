import { combineReducers, configureStore } from "@reduxjs/toolkit"
import persistReducer from "redux-persist/es/persistReducer"
import persistStore from "redux-persist/es/persistStore"
import storage from "redux-persist/lib/storage"

import { authReducer, userReducer } from "~/entities"

const persistConfig = {
  key: "root",
  storage,
}

export const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
})

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
})

export const persistor = persistStore(store)

export default store
