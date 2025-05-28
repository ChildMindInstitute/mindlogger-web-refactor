import { useEffect, useState } from 'react';

import { Trans } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Banner, BannerProps } from '../Banner';
import { StyledImg } from './RebrandBanner.styles';

import curiousIcon from '~/assets/curious_icon--white.png';
import { userModel } from '~/entities/user';
import { REBRAND_BANNER_EXCLUDED_ROUTES } from '~/shared/ui/Banners/lib/const';

/**
 * Returns a unique key for the rebrand banner dismiss state
 * Otherwise, it creates a user-only key for use on the auth screen
 */
export const getDismissedKey = (userId: string) => `rebrand-banner-dismissed-${userId}`;

export const GLOBAL_DISMISSED_KEY = 'rebrand-banner-dismissed-global';

export const RebrandBanner = (props: BannerProps) => {
  const location = useLocation();
  const { isAuthorized, user } = userModel.hooks.useAuthorization();
  const userId = user?.id;
  const [isRebrandBannerActive, setIsRebrandBannerActive] = useState(false);

  const dismissedKey = isAuthorized && userId ? getDismissedKey(userId) : GLOBAL_DISMISSED_KEY;

  useEffect(() => {
    const dismissed = localStorage.getItem(dismissedKey);
    setIsRebrandBannerActive(!dismissed);
  }, [dismissedKey]);

  const isExcludedRoute = REBRAND_BANNER_EXCLUDED_ROUTES.some((route) => {
    const routePattern = route.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(location.pathname);
  });

  const handleDismiss = () => {
    localStorage.setItem(dismissedKey, 'true');
    setIsRebrandBannerActive(false);
  };

  return isRebrandBannerActive && !isExcludedRoute ? (
    <Banner
      duration={null}
      severity={undefined}
      data-testid="rebrand-banner"
      icon={<StyledImg src={curiousIcon} />}
      sx={{
        backgroundColor: '#0b0907',
        color: '#fdfcfc',
        '& .MuiAlert-message': {
          maxWidth: 'none',
        },
        '& .MuiButton-root': {
          color: '#fdfcfc',
        },
      }}
      {...props}
      onClose={() => {
        handleDismiss();
        props?.onClose?.();
      }}
    >
      <Trans i18nKey="rebrandBanner">
        <strong>We are rebranding! </strong>
        <>Design updates are on the way—same great app, fresh new look.</>
        {/* 
								Uncomment once the URL is available
								https://mindlogger.atlassian.net/browse/M2-9258
							*/}
        {/* <StyledLink href={CURIOUS_REBRAND_URL} target="_blank">
                Click to learn more.
              </StyledLink> */}
      </Trans>
    </Banner>
  ) : null;
};
