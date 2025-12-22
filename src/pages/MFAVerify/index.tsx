import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { userModel } from '~/entities/user';
import { MFAForm, useLoginTranslation } from '~/features/Login';
import { useMFAContext } from '~/features/Login/lib/MFAContext';
import { ROUTES } from '~/shared/constants';
import { variables } from '~/shared/constants/theme/variables';
import { Box } from '~/shared/ui';

function MFAVerifyPage() {
  const { t } = useLoginTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { session, clearSession } = useMFAContext();

  const { onLoginSuccess } = userModel.hooks.useOnLogin({
    backRedirectPath: location.state?.backRedirectPath as string,
  });

  // Route guard: redirect to login if no session
  useEffect(() => {
    if (!session) {
      navigate(ROUTES.login.path, { replace: true });
    }
  }, [session, navigate]);

  // Prevent flash of content when no session
  if (!session) {
    return null;
  }

  const handleMFASuccess = (result: {
    user: { id: string; firstName: string; lastName: string; email: string };
    tokens: { accessToken: string; refreshToken: string; tokenType: string };
    password: string;
  }) => {
    onLoginSuccess({
      user: {
        ...result.user,
        password: result.password,
      },
      tokens: result.tokens,
    });
  };

  const handleSwitchToRecovery = () => {
    navigate(ROUTES.verifyRecovery.path);
  };

  const handleBackToLogin = () => {
    clearSession();
    navigate(ROUTES.login.path, { replace: true });
  };

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center">
      <Box
        sx={{
          display: 'flex',
          width: '473px',
          padding: '32px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '32px',
          borderRadius: '16px',
          border: `1px solid ${variables.palette.surfaceVariant}`,
          background: variables.palette.surface,
        }}
      >
        <MFAForm
          onSuccess={handleMFASuccess}
          onSwitchToRecovery={handleSwitchToRecovery}
          onBackToLogin={handleBackToLogin}
        />
      </Box>
    </Box>
  );
}

export default MFAVerifyPage;
