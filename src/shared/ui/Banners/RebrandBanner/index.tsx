import { useEffect, useState } from 'react';

import { Box, Collapse } from '@mui/material';
import { Trans } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Banner, BannerProps } from '../Banner';
import { StyledImg } from './RebrandBanner.styles';

import curiousIcon from '~/assets/curious_icon--white.png';
import { userModel } from '~/entities/user';

/**
 * Returns a unique key for the rebrand banner dismiss state
 * Otherwise, it creates a user-only key for use on the auth screen
 */
export const getDismissedKey = (userId: string) => `rebrand-banner-dismissed-${userId}`;

export const GLOBAL_DISMISSED_KEY = 'rebrand-banner-dismissed-global';

const DISPLAY_ROUTES = [/^\/login$/, /^\/protected\/applets$/, /^\/protected\/applets\/[^/]+$/];

export const RebrandBanner = (props: BannerProps) => {
  const location = useLocation();
  const { isAuthorized, user } = userModel.hooks.useAuthorization();
  const userId = user?.id;

  const [isRebrandBannerActive, setIsRebrandBannerActive] = useState(true);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const handleOnExited = () => {
    if (isCollapsing) {
      setIsCollapsing(false);
      setIsRebrandBannerActive(false);
    }
  };

  const dismissedKey = isAuthorized && userId ? getDismissedKey(userId) : GLOBAL_DISMISSED_KEY;

  useEffect(() => {
    const dismissed = localStorage.getItem(dismissedKey);
    setIsRebrandBannerActive(!dismissed);
  }, [dismissedKey]);

  const isDisplayRoute = DISPLAY_ROUTES.some((route) => route.test(location.pathname));

  const handleDismiss = () => {
    localStorage.setItem(dismissedKey, 'true');
    setIsCollapsing(true);
  };

  const shouldRender = isDisplayRoute && (location.pathname.startsWith('/login') || isAuthorized);

  return shouldRender ? (
    <Box>
      <Collapse in={isRebrandBannerActive && !isCollapsing} enter={false} onExited={handleOnExited}>
        {isRebrandBannerActive && (
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
        )}
      </Collapse>
    </Box>
  ) : null;
};
