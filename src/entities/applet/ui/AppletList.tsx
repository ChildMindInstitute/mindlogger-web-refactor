import { AppletCard } from './AppletCard';
import { AppletListItem } from '../lib';

import { Box } from '~/shared/ui';

type Props = {
  applets: AppletListItem[];
};

export const AppletList = (props: Props) => {
  return (
    <Box display="flex" flex={1} flexWrap="wrap" justifyContent="center" data-testid="applet-list">
      {props.applets.map((applet) => (
        <AppletCard key={applet.id} applet={applet} />
      ))}
    </Box>
  );
};
