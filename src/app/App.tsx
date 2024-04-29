import Providers from './providers';
import i18nManager from './system/locale/i18n';

import ApplicationRouter from '~/pages';
import { Mixpanel } from '~/shared/utils';

import '~/assets/fonts/Atkinson/atkinson.css';

import './index.css';

Mixpanel.init();
i18nManager.initialize();

function App() {
  return (
    <Providers>
      <ApplicationRouter />
    </Providers>
  );
}

export default App;
