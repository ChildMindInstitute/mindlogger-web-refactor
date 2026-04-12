import { Link } from 'react-router-dom';

import { useLoginTranslation } from '../lib/useLoginTranslation';
import { LoginSchema, TLoginForm } from '../model/login.schema';
import { MFARequiredResponse, isMFARequiredResponse } from '../model/mfa.types';

import { useBanners } from '~/entities/banner/model';
import { ILoginPayload, useLoginMutation, userModel } from '~/entities/user';
import { LoginResult } from '~/shared/api';
import { ROUTES } from '~/shared/constants';
import { BaseButton, BasicFormProvider, Box, Input, PasswordIcon, Text } from '~/shared/ui';
import {
  Mixpanel,
  MixpanelEventType,
  MixpanelProps,
  useCustomForm,
  usePasswordType,
} from '~/shared/utils';

interface LoginFormProps {
  locationState?: Record<string, unknown>;
  /** Callback when MFA is required - receives MFA session data and password for encryption */
  onMFARequired: (mfaData: MFARequiredResponse, password: string) => void;
}

export const LoginForm = ({ locationState, onMFARequired }: LoginFormProps) => {
  const { t } = useLoginTranslation();

  const { addErrorBanner, removeErrorBanner } = useBanners();

  const [passwordType, onPasswordIconClick] = usePasswordType();

  const form = useCustomForm({ defaultValues: { email: '', password: '' } }, LoginSchema);
  const { handleSubmit } = form;

  const { onLoginSuccess } = userModel.hooks.useOnLogin({
    backRedirectPath: locationState?.backRedirectPath as string,
  });

  const { mutate: login, isLoading } = useLoginMutation({
    onSuccess(data, variables) {
      const result: LoginResult = data.data.result;

      // Check if MFA is required
      if (isMFARequiredResponse(result)) {
        // Track login button click with MFA required
        Mixpanel.track({
          action: MixpanelEventType.LoginBtnClick,
          [MixpanelProps.MFARequired]: true,
          [MixpanelProps.AuthMethod]: 'Password',
        });

        Mixpanel.track({ action: MixpanelEventType.MFARequired });
        onMFARequired(result, variables.password);
        return;
      }

      // Normal login flow (no MFA)
      // TypeScript now knows result is LoginSuccessResult
      const { user, token } = result;

      // Track login button click without MFA
      Mixpanel.track({
        action: MixpanelEventType.LoginBtnClick,
        [MixpanelProps.MFARequired]: false,
        [MixpanelProps.AuthMethod]: 'Password',
      });

      removeErrorBanner();

      return onLoginSuccess({
        user: {
          ...user,
          password: variables.password,
        },
        tokens: token,
        mfaUsed: false,
        mfaMethod: null,
      });
    },
    onError(error) {
      if (error.evaluatedMessage) {
        addErrorBanner(t('invalidCredentials'));

        // Track login failed at credentials stage
        Mixpanel.track({
          action: MixpanelEventType.LoginFailed,
          [MixpanelProps.FailureStage]: 'Credentials',
          [MixpanelProps.MFARequired]: false, // Unknown at this stage
          [MixpanelProps.MFAMethodUsed]: null,
        });
      }
    },
  });

  const onLoginSubmit = (data: TLoginForm) => {
    login(data as ILoginPayload);
  };

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onLoginSubmit)}>
      <Box display="flex" flex={1} flexDirection="column" gap="24px">
        <Input
          id="login-form-email-input"
          type="text"
          name="email"
          placeholder={t('email') || ''}
          autoComplete="username"
        />
        <Input
          id="login-form-password-input"
          type={passwordType}
          name="password"
          placeholder={t('password') || ''}
          autoComplete="current-password"
          Icon={
            <PasswordIcon isSecure={passwordType === 'password'} onClick={onPasswordIconClick} />
          }
        />

        <Box display="flex" justifyContent="center">
          <Text>
            <Link
              to={ROUTES.forgotPassword.path}
              relative="path"
              style={{ textDecoration: 'underline' }}
            >
              {t('forgotPassword')}
            </Link>
          </Text>
        </Box>

        <BaseButton type="submit" variant="contained" isLoading={isLoading} text={t('button')} />
      </Box>
    </BasicFormProvider>
  );
};
