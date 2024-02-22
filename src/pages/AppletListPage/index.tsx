import { useEffect } from 'react';

import { Mixpanel } from '~/shared/utils';
import { AppletListWidget } from '~/widgets/AppletList';

function AppletListPage() {
  useEffect(() => {
    Mixpanel.trackPageView('Dashboard');
  }, []);

  return <AppletListWidget />;
}

export default AppletListPage;
