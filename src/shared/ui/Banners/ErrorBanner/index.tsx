import { Trans } from 'react-i18next';

import { Banner, BannerProps } from '../Banner';

type ErrorBannerProps = BannerProps & {
  i18nKey?: string;
  children?: string;
};

export const ErrorBanner = ({ i18nKey, children, ...props }: ErrorBannerProps) => {
  return (
    <Banner severity="error" {...props}>
      {i18nKey ? <Trans i18nKey={i18nKey} /> : children}
    </Banner>
  );
};
