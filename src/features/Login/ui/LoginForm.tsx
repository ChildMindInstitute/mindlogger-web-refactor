import { Link } from 'react-router-dom';

import { useLoginTranslation } from '../lib/useLoginTranslation';
import { LoginSchema, TLoginForm } from '../model/login.schema';

import { useBanners } from '~/entities/banner/model';
import { ILoginPayload, useLoginMutation, userModel } from '~/entities/user';
import { ROUTES, Theme } from '~/shared/constants';
import { BaseButton, BasicFormProvider, Box, Input, PasswordIcon, Text } from '~/shared/ui';
import { Mixpanel, MixpanelEventType, useCustomForm, usePasswordType } from '~/shared/utils';

interface LoginFormProps {
  locationState?: Record<string, unknown>;
}

export const LoginForm = ({ locationState }: LoginFormProps) => {
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
      const { user, token } = data.data.result;

      removeErrorBanner();

      return onLoginSuccess({
        user: {
          ...user,
          password: variables.password,
        },
        tokens: token,
      });
    },
    onError(error) {
      if (error.evaluatedMessage) {
        addErrorBanner(error.evaluatedMessage);
      }
    },
  });

  const onLoginSubmit = (data: TLoginForm) => {
    login(data as ILoginPayload);
  };

  const onLoginButtonClick = () => {
    Mixpanel.track({ action: MixpanelEventType.LoginBtnClick });
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
          <Link to={ROUTES.forgotPassword.path} relative="path">
            <Text
              color={Theme.colors.light.primary}
              fontSize="16px"
              fontWeight="400"
              lineHeight="20px"
              letterSpacing="0.1px"
              sx={{ textDecoration: 'underline' }}
            >
              {t('forgotPassword')}
            </Text>
          </Link>
        </Box>

        <BaseButton
          type="submit"
          variant="contained"
          isLoading={isLoading}
          onClick={onLoginButtonClick}
          text={t('button')}
        />
      </Box>
    </BasicFormProvider>
  );
};
