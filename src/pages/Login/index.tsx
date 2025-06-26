import { lazy } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useBanners } from '~/entities/banner/model';
import { LoginForm, useLoginTranslation } from '~/features/Login';
import { ROUTES } from '~/shared/constants';
import { variables } from '~/shared/constants/theme/variables';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { Mixpanel, MixpanelEventType, useOnceEffect } from '~/shared/utils';

const DownloadMobileLinks = lazy(() => import('~/widgets/DownloadMobileLinks'));

function LoginPage() {
  const { t } = useLoginTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { addSuccessBanner } = useBanners();

  const onCreateAccountClick = () => {
    Mixpanel.track({ action: MixpanelEventType.LoginScreenCreateAccountBtnClick });
  };

  useOnceEffect(() => {
    Mixpanel.trackPageView('Login');

    if (location.state?.isPasswordReset) {
      // Shown for 5 seconds
      addSuccessBanner({ children: t('passwordResetSuccessful'), duration: 5000 });

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
      <Box
        flex={1}
        gap="20px"
        flexDirection="column"
        sx={{
          padding: '24px 32px',
          '& a': { color: variables.palette.primary, textDecoration: 'underline' },
        }}
      >
        <Text
          color={variables.palette.onSurface}
          sx={{ marginBottom: '24px' }}
          variant="titleLargeBold"
        >
          {t('title')}
        </Text>

        <Box className="loginForm" maxWidth="400px" margin="0 auto">
          <LoginForm locationState={location.state as Record<string, unknown>} />
        </Box>

        <Box margin="24px 0px" display="flex" justifyContent="center">
          <Text>{t('or')},</Text>
          &nbsp;
          <Text>
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
