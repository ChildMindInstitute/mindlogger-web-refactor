import { Trans } from 'react-i18next';

import { Banner, BannerProps } from '../Banner';

// Raised on the login page when a session ended on its own, so the user is not left guessing why
// they are looking at it. Signing in from here resumes the page they were on.
export const SoftLockWarningBanner = (props: BannerProps) => (
  <Banner duration={null} severity="warning" data-testid="soft-lock-warning-banner" {...props}>
    <Trans i18nKey="softLockWarningBanner">
      <strong>To keep your account secure, you were automatically logged out.</strong>
      <div>Please enter your password below to resume where you left off.</div>
    </Trans>
  </Banner>
);
