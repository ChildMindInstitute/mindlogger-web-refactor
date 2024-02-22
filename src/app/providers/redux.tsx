import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import store, { persistor } from '../store';

interface ReduxProps {
  children: React.ReactNode;
}

function ReduxProvider(props: ReduxProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {props.children}
      </PersistGate>
    </Provider>
  );
}

export default ReduxProvider;
