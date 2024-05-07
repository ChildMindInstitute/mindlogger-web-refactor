import { lazy } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { LoginForm, useLoginTranslation } from '~/features/Login';
import { ROUTES, Theme } from '~/shared/constants';
import { useNotification } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { Mixpanel, useOnceEffect } from '~/shared/utils';

const DownloadMobileLinks = lazy(() => import('~/widgets/DownloadMobileLinks'));

function LoginPage() {
  const { t } = useLoginTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccessNotification } = useNotification();

  const onCreateAccountClick = () => {
    Mixpanel.track('Create account button on login screen click');
  };

  useOnceEffect(() => {
    Mixpanel.trackPageView('Login');

    if (location.state?.isPasswordReset) {
      // Shown for 5 seconds
      showSuccessNotification(t('passwordResetSuccessful'), {
        duration: 5000,
        allowDuplicate: false,
      });

      // Unset the state after showing the notification, so that it doesn't show again if the user navigates back to this page
      navigate(window.location.pathname, {
        state: {
          ...location.state,
          isPasswordReset: undefined,
        } as unknown,
        replace: true,
      });
    }
  });

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center" textAlign="center">
      <Box flex={1} padding="24px 32px" gap="20px" flexDirection="column">
        <Text
          variant="h5"
          color={Theme.colors.light.onSurface}
          fontSize="22px"
          fontWeight="700"
          lineHeight="28px"
          sx={{ marginBottom: '24px' }}
        >
          {t('title')}
        </Text>

        <Box className="loginForm" maxWidth="400px" margin="0 auto">
          <LoginForm locationState={location.state as Record<string, unknown>} />
        </Box>

        <Box margin="24px 0px" display="flex" justifyContent="center">
          <Text fontSize="16px" fontWeight="400" lineHeight="20px" letterSpacing="0.1px">
            {t('or')},
          </Text>
          &nbsp;
          <Text
            color={Theme.colors.light.primary}
            fontSize="16px"
            fontWeight="400"
            lineHeight="20px"
            letterSpacing="0.1px"
            sx={{ textDecoration: 'underline' }}
          >
            <Link to={ROUTES.signup.path} relative="path" onClick={onCreateAccountClick}>
              {t('create')}
            </Link>
          </Text>
        </Box>

        <DownloadMobileLinks />
      </Box>
    </Box>
  );
}

export default LoginPage;
