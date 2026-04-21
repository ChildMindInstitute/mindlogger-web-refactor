import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useRecoveryPasswordTranslation } from '../lib/useRecoveryPasswordTranslation';
import { RecoveryPassword, RecoveryPasswordSchema } from '../model/schema';

import { useApproveRecoveryPasswordMutation } from '~/entities/user';
import { DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS } from '~/shared/constants';
import ROUTES from '~/shared/constants/routes';
import { Box } from '~/shared/ui';
import {
  BaseButton,
  BasicFormProvider,
  Container,
  DisplaySystemMessage,
  Input,
  PasswordIcon,
  PasswordRequirementsSection,
} from '~/shared/ui';
import { useCustomForm, usePasswordType } from '~/shared/utils';

interface RecoveryPasswordFormProps {
  title?: string | null;
  token?: string | null;
  email?: string | null;
}

export const RecoveryPasswordForm = ({ title, token, email }: RecoveryPasswordFormProps) => {
  const navigate = useNavigate();
  const { t } = useRecoveryPasswordTranslation();

  const form = useCustomForm(
    { defaultValues: { new: '', confirm: '' }, mode: 'onTouched' },
    RecoveryPasswordSchema,
  );
  const { handleSubmit, reset } = form;

  const [showPasswordError, setShowPasswordError] = useState<boolean>(false);

  const {
    mutate: approveRecoveryPassword,
    isLoading,
    error,
    status,
  } = useApproveRecoveryPasswordMutation({
    onSuccess() {
      reset();
    },
  });
  const onSubmit = (data: RecoveryPassword) => {
    if (token && email) {
      return approveRecoveryPassword({ key: token, email, password: data.new });
    }
  };

  const [newPasswordType, onNewPasswordIconClick] = usePasswordType();
  const [confirmNewPasswordType, onConfirmNewPasswordIconClick] = usePasswordType();

  if (status === 'success') {
    // Auto-navigate to the login page
    navigate(ROUTES.login.path, {
      state: { isPasswordReset: true },
    });
    return <></>;
  }

  return (
    <Container className="change-password-form-container">
      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <Box className="overflow-hidden" marginBottom={2}>
          <p>{title}</p>
        </Box>

        <Box display="flex" flex={1} gap="24px" flexDirection="column">
          <PasswordRequirementsSection
            fieldName="new"
            delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
            setShowPasswordError={setShowPasswordError}
          >
            <Input
              id="recovery-password-new-password"
              type={newPasswordType}
              name="new"
              placeholder={t('newPassword') || ''}
              autoComplete="new-password"
              showError={showPasswordError}
              Icon={
                <>
                  <PasswordIcon
                    isSecure={newPasswordType === 'password'}
                    onClick={onNewPasswordIconClick}
                  />
                </>
              }
            />
          </PasswordRequirementsSection>
          <Input
            id="recovery-password-confirm-new-password"
            type={confirmNewPasswordType}
            name="confirm"
            placeholder={t('confirmPassword') || ''}
            autoComplete="new-password"
            Icon={
              <PasswordIcon
                isSecure={confirmNewPasswordType === 'password'}
                onClick={onConfirmNewPasswordIconClick}
              />
            }
          />
        </Box>

        <DisplaySystemMessage errorMessage={error?.evaluatedMessage} />

        <Box marginY={3}>
          <BaseButton type="submit" variant="contained" isLoading={isLoading} text={t('submit')} />
        </Box>
      </BasicFormProvider>
    </Container>
  );
};
