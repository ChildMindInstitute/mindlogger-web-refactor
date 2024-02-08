import { useState } from 'react';

import Box from '@mui/material/Box';

import { TERMS_URL } from '../lib/constants';
import { useSignupTranslation } from '../lib/useSignupTranslation';
import { SignupFormSchema, TSignupForm } from '../model/signup.schema';

import { useLoginMutation, userModel, useSignupMutation } from '~/entities/user';
import { Input, CheckboxWithLabel, BasicFormProvider, PasswordIcon, BaseButton, useNotification } from '~/shared/ui';
import { Mixpanel, useCustomForm, usePasswordType } from '~/shared/utils';

interface SignupFormProps {
  locationState?: Record<string, unknown>;
}

export const SignupForm = ({ locationState }: SignupFormProps) => {
  const { t } = useSignupTranslation();

  const { showErrorNotification, showSuccessNotification } = useNotification();

  const [passwordType, onPasswordIconClick] = usePasswordType();
  const [confirmPasswordType, onConfirmPasswordIconClick] = usePasswordType();

  const [terms, setTerms] = useState<boolean>(false);
  const { onLoginSuccess } = userModel.hooks.useOnLogin({
    isInvitationFlow: locationState?.isInvitationFlow as boolean,
    backRedirectPath: locationState?.backRedirectPath as string,
  });

  const form = useCustomForm(
    { defaultValues: { email: '', firstName: '', lastName: '', password: '', confirmPassword: '' } },
    SignupFormSchema,
  );
  const { handleSubmit } = form;

  const { mutate: login, isLoading: isLoginLoading } = useLoginMutation({
    onSuccess(data, variables) {
      const { user, token } = data.data.result;

      return onLoginSuccess({
        user: {
          ...user,
          password: variables.password,
        },
        tokens: token,
      });
    },
  });

  const { mutate: signup, isLoading: isSignupLoading } = useSignupMutation({
    onSuccess() {
      showSuccessNotification(t('success'));
      Mixpanel.track('Signup Successful');
      const { email, password } = form.getValues();

      return login({ email, password });
    },
    onError(error) {
      if (error.evaluatedMessage) {
        showErrorNotification(error.evaluatedMessage);
      }
    },
  });

  const onSignupSubmit = (data: TSignupForm) => {
    if (!terms) {
      return showErrorNotification(t('pleaseAgreeTerms'));
    }

    return signup(data);
  };

  return (
    <BasicFormProvider {...form} onSubmit={handleSubmit(onSignupSubmit)}>
      <Box display="flex" flexDirection="column" gap="24px">
        <Input id="signup-form-email" type="text" name="email" placeholder={t('email') || ''} autoComplete="username" />
        <Input id="signup-form-firstname" type="text" name="firstName" placeholder={t('firstName') || ''} />
        <Input id="signup-form-lastname" type="text" name="lastName" placeholder={t('lastName') || ''} />
        <Input
          id="signup-form-new-password"
          type={passwordType}
          name="password"
          placeholder={t('password') || ''}
          autoComplete="new-password"
          Icon={<PasswordIcon isSecure={passwordType === 'password'} onClick={onPasswordIconClick} />}
        />
        <Input
          id="signup-form-confirm-password"
          type={confirmPasswordType}
          name="confirmPassword"
          placeholder={t('confirmPassword') || ''}
          autoComplete="new-password"
          Icon={<PasswordIcon isSecure={confirmPasswordType === 'password'} onClick={onConfirmPasswordIconClick} />}
        />

        <Box display="flex" justifyContent="center">
          <CheckboxWithLabel id="terms" onChange={() => setTerms(prev => !prev)}>
            I agree to the{' '}
            <a href={TERMS_URL} target="_blank" rel="noreferrer">
              Terms of Service
            </a>
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
