import { useEffect, useState } from 'react';

import { useWatch } from 'react-hook-form';

import { TERMS_URL } from '../lib/constants';
import { useSignupTranslation } from '../lib/useSignupTranslation';
import { SignupFormSchema, TSignupForm } from '../model/signup.schema';

import { useBanners } from '~/entities/banner/model';
import { useLoginMutation, userModel, useSignupMutation } from '~/entities/user';
import { isMFARequiredResponse } from '~/features/Login/model/mfa.types';
import { LoginResult } from '~/shared/api';
import {
  BaseButton,
  BasicFormProvider,
  Box,
  CheckboxWithLabel,
  Input,
  PasswordIcon,
  PasswordRequirementsSection,
  Text,
} from '~/shared/ui';
import { Mixpanel, MixpanelEventType, useCustomForm, usePasswordType } from '~/shared/utils';

interface SignupFormProps {
  locationState?: Record<string, unknown>;
}

export const SignupForm = ({ locationState }: SignupFormProps) => {
  const { t } = useSignupTranslation();

  const { addErrorBanner, addSuccessBanner, removeErrorBanner } = useBanners();

  const [passwordType, onPasswordIconClick] = usePasswordType();
  const [confirmPasswordType, onConfirmPasswordIconClick] = usePasswordType();

  const [terms, setTerms] = useState<boolean>(false);
  const { onLoginSuccess } = userModel.hooks.useOnLogin({
    backRedirectPath:
      typeof locationState?.backRedirectPath === 'string'
        ? locationState.backRedirectPath
        : undefined,
  });

  const form = useCustomForm(
    {
      defaultValues: { email: '', firstName: '', lastName: '', password: '', confirmPassword: '' },
      mode: 'onTouched',
    },
    SignupFormSchema,
  );
  const { handleSubmit, trigger, clearErrors } = form;

  const passwordValue = useWatch({ control: form.control, name: 'password' });

  useEffect(() => {
    if (!passwordValue) {
      return;
    }

    const timer = setTimeout(async () => {
      await trigger('password');
    }, 500);

    return () => clearTimeout(timer);
  }, [passwordValue, trigger, clearErrors]);

  const { mutate: login, isLoading: isLoginLoading } = useLoginMutation({
    onSuccess(data, variables) {
      const result: LoginResult = data.data.result;

      // After signup, MFA should not be required (newly created accounts don't have MFA enabled)
      // But handle it gracefully just in case
      if (isMFARequiredResponse(result)) {
        // This shouldn't happen for new accounts, but if it does, show an error
        addErrorBanner(t('unexpectedError'));
        return;
      }

      // TypeScript now knows result is LoginSuccessResult (not MFARequiredResult)
      const { user, token } = result;

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
  });

  const { mutate: signup, isLoading: isSignupLoading } = useSignupMutation({
    onSuccess() {
      removeErrorBanner();
      addSuccessBanner(t('success'));
      Mixpanel.track({ action: MixpanelEventType.SignupSuccessful });
      const { email, password } = form.getValues();

      return login({ email, password });
    },
    onError(error) {
      if (error.evaluatedMessage) {
        addErrorBanner(error.evaluatedMessage);
      }
    },
  });

  const onSignupSubmit = (data: TSignupForm) => {
    if (!terms) {
      return addErrorBanner(t('pleaseAgreeTerms'));
    }

    return signup(data);
  };

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onSignupSubmit)}>
      <Box display="flex" flexDirection="column" gap="24px">
        <Input
          id="signup-form-email"
          type="text"
          name="email"
          placeholder={t('email') || ''}
          autoComplete="username"
        />
        <Input
          id="signup-form-firstname"
          type="text"
          name="firstName"
          placeholder={t('firstName') || ''}
        />
        <Input
          id="signup-form-lastname"
          type="text"
          name="lastName"
          placeholder={t('lastName') || ''}
        />
        <PasswordRequirementsSection password={passwordValue || ''}>
          <Input
            id="signup-form-new-password"
            type={passwordType}
            name="password"
            placeholder={t('password') || ''}
            autoComplete="new-password"
            showError={false}
            Icon={
              <>
                <PasswordIcon
                  isSecure={passwordType === 'password'}
                  onClick={onPasswordIconClick}
                />
              </>
            }
          />
        </PasswordRequirementsSection>
        <Input
          id="signup-form-confirm-password"
          type={confirmPasswordType}
          name="confirmPassword"
          placeholder={t('confirmPassword') || ''}
          autoComplete="new-password"
          Icon={
            <PasswordIcon
              isSecure={confirmPasswordType === 'password'}
              onClick={onConfirmPasswordIconClick}
            />
          }
        />

        <Box display="flex" justifyContent="center">
          <CheckboxWithLabel id="terms" onChange={() => setTerms((prev) => !prev)}>
            <Text>
              {`${t('iAgreeTo')} `}
              <a href={TERMS_URL} target="_blank" rel="noreferrer">
                {t('termsOfService')}
              </a>
            </Text>
          </CheckboxWithLabel>
        </Box>

        <BaseButton
          type="submit"
          variant="contained"
          text={t('create')}
          isLoading={isSignupLoading || isLoginLoading}
        />
      </Box>
    </BasicFormProvider>
  );
};
