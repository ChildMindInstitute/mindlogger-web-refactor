import { useEffect } from 'react';

import { Link, useLocation } from 'react-router-dom';

import { SignupForm, useSignupTranslation } from '~/features/Signup';
import { ROUTES } from '~/shared/constants';
import { variables } from '~/shared/constants/theme/variables';
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
      <Box
        flex={1}
        sx={{
          padding: '24px 32px',
          '& a': { color: variables.palette.primary, textDecoration: 'underline' },
        }}
      >
        <Text
          color={variables.palette.onSurface}
          variant="titleLargeBold"
          sx={{ marginBottom: '24px' }}
        >
          {t('title')}
        </Text>

        <Box className="signupForm" maxWidth="400px" margin="0 auto">
          <SignupForm locationState={location.state as Record<string, unknown>} />
        </Box>

        <Box margin="24px 0px" display="flex" justifyContent="center">
          <Text>{t('or')},</Text>
          &nbsp;
          <Text>
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
