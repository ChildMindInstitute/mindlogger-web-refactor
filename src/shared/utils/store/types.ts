import store, { rootReducer } from "~/app/store"

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
