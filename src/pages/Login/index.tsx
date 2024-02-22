import { lazy, useRef } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { LoginForm, useLoginTranslation } from '~/features/Login';
import { ROUTES, Theme } from '~/shared/constants';
import { useNotification } from '~/shared/ui';
import { Notification } from '~/shared/ui/NotificationCenter/lib/types';
import { Mixpanel, useOnceEffect } from '~/shared/utils';

const DownloadMobileLinks = lazy(() => import('~/widgets/DownloadMobileLinks'));

function LoginPage() {
  const { t } = useLoginTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccessNotification } = useNotification();
  const notificationRef = useRef<Notification | null>(null);

  const onCreateAccountClick = () => {
    Mixpanel.track('Create account button on login screen click');
  };

  useOnceEffect(() => {
    Mixpanel.trackPageView('Login');

    if (location.state?.isPasswordReset && !notificationRef.current) {
      // Shown for 5 seconds
      notificationRef.current = showSuccessNotification(t('passwordResetSuccessful'), 5000);

      // Unset the state after showing the notification, so that it doesn't show again if the user navigates back to this page
      navigate(window.location.pathname, {
        state: {
          ...location.state,
          isPasswordReset: undefined,
        },
        replace: true,
      });
    }
  });

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center" textAlign="center">
      <Box flex={1} padding="24px 32px" gap="20px" flexDirection="column">
        <Typography
          variant="h5"
          color={Theme.colors.light.onSurface}
          fontFamily="Atkinson"
          fontSize="22px"
          fontStyle="normal"
          fontWeight={700}
          lineHeight="28px"
          marginBottom="24px"
        >
          {t('title')}
        </Typography>

        <Box className="loginForm" maxWidth="400px" margin="0 auto">
          <LoginForm locationState={location.state} />
        </Box>

        <Box margin="24px 0px" display="flex" justifyContent="center">
          <Typography
            fontFamily="Atkinson"
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            lineHeight="20px"
            letterSpacing="0.1px"
          >
            {t('or')},
          </Typography>
          &nbsp;
          <Typography
            color={Theme.colors.light.primary}
            fontFamily="Atkinson"
            fontSize="16px"
            fontWeight={400}
            fontStyle="normal"
            lineHeight="20px"
            letterSpacing="0.1px"
            sx={{ textDecoration: 'underline' }}
          >
            <Link to={ROUTES.signup.path} relative="path" onClick={onCreateAccountClick}>
              {t('create')}
            </Link>
          </Typography>
        </Box>

        <DownloadMobileLinks />
      </Box>
    </Box>
  );
}

export default LoginPage;
