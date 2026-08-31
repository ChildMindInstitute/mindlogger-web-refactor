import { Trans } from 'react-i18next';

import { StyledReloadButton } from './SessionElsewhereBanner.styles';
import { Banner, BannerProps } from '../Banner';

// Reloading is how this tab reaches a session it can see but is not in: the encrypted store is only
// re-read when the page loads.
const reloadIntoSession = () => window.location.reload();

export const SessionElsewhereBanner = (props: BannerProps) => (
  <Banner duration={null} severity="warning" data-testid="session-elsewhere-banner" {...props}>
    <Trans i18nKey="sessionElsewhereBanner">
      <>You signed in with another tab or window. </>
      <StyledReloadButton onClick={reloadIntoSession}>Reload</StyledReloadButton>
      <> to refresh your session.</>
    </Trans>
  </Banner>
);
