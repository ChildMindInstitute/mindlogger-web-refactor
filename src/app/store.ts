import { combineReducers, configureStore } from "@reduxjs/toolkit"
import persistReducer from "redux-persist/es/persistReducer"
import persistStore from "redux-persist/es/persistStore"
import storage from "redux-persist/lib/storage"

import { userModel } from "~/entities/user"

const persistConfig = {
  key: "root",
  storage,
}

export const rootReducer = combineReducers({
  user: userModel.reducer,
})

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
})

export const persistor = persistStore(store)

export default store
