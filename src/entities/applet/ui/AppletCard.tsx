import { AppletListItem } from '../lib';

import ROUTES from '~/shared/constants/routes';
import { Box } from '~/shared/ui';
import { CustomCard } from '~/shared/ui';
import { MixpanelEvents, MixpanelProps, Mixpanel, useCustomNavigation } from '~/shared/utils';

type Props = {
  applet: AppletListItem;
};

export const AppletCard = ({ applet }: Props) => {
  const navigator = useCustomNavigation();

  const onAppletCardClick = () => {
    Mixpanel.track(MixpanelEvents.AppletClick, { [MixpanelProps.AppletId]: applet.id });
    return navigator.navigate(ROUTES.appletDetails.navigateTo(applet.id));
  };

  return (
    <Box data-testid="applet-card">
      <CustomCard
        id={applet.id}
        title={applet.displayName}
        description={applet.description}
        imageSrc={applet.image}
        onClick={onAppletCardClick}
      />
    </Box>
  );
};
