import { PropsWithChildren } from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/lib/integration/react"
import store, { persistor } from "./store"

type Props = PropsWithChildren<unknown>

export default function StoreProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
