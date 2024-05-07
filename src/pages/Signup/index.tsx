import { useEffect } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { SignupForm, useSignupTranslation } from '~/features/Signup';
import { ROUTES, Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { Mixpanel } from '~/shared/utils';

function SignupPage() {
  const { t } = useSignupTranslation();
  const location = useLocation();

  useEffect(() => {
    Mixpanel.trackPageView('Create account');
  }, []);

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center" textAlign="center">
      <Box flex={1} padding="24px 32px">
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

        <Box className="signupForm" maxWidth="400px" margin="0 auto">
          <SignupForm locationState={location.state as Record<string, unknown>} />
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
            <Link to={ROUTES.login.path} relative="path">
              {t('logIn')}
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default SignupPage;
