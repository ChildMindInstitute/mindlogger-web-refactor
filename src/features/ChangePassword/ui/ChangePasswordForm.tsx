import { useState } from 'react';


import { useChangePasswordTranslation } from '../lib/useChangePasswordTranslation';
import { ChangePasswordSchema, TChangePassword } from '../model/schema';

import { useUpdatePasswordMutation } from '~/entities/user';
import { DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS } from '~/shared/constants';
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

import './style.css';

interface ChangePasswordFormProps {
  title?: string | null;
}

export const ChangePasswordForm = ({ title }: ChangePasswordFormProps) => {
  const { t } = useChangePasswordTranslation();

  const [oldPasswordType, onOldPasswordIconClick] = usePasswordType();
  const [newPasswordType, onNewPasswordIconClick] = usePasswordType();
  const [confirmNewPasswordType, onConfirmNewPasswordIconClick] = usePasswordType();
  const [showPasswordError, setShowPasswordError] = useState<boolean>(false);

  const form = useCustomForm(
    { defaultValues: { old: '', new: '', confirm: '' }, mode: 'onTouched' },
    ChangePasswordSchema,
  );
  const { handleSubmit, reset } = form;

  const {
    mutate: updatePassword,
    error,
    isLoading,
    isSuccess,
  } = useUpdatePasswordMutation({
    onSuccess() {
      reset();
    },
  });

  const onSubmit = (data: TChangePassword) => {
    return updatePassword({ password: data.new, prev_password: data.old });
  };

  return (
    <Container className="change-password-form-container">
      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap="24px">
          <Container className="overflow-hidden">
            <p>{title}</p>
          </Container>

          <Input
            id="change-password-form-old-password"
            type={oldPasswordType}
            name="old"
            placeholder={t('oldPassword') || ''}
            autoComplete="current-password"
            onFocus={() => {
              setShowPasswordError(false);
            }}
            Icon={
              <PasswordIcon
                isSecure={oldPasswordType === 'password'}
                onClick={onOldPasswordIconClick}
              />
            }
          />
          <PasswordRequirementsSection
            fieldName="new"
            delayMs={DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS}
            setShowPasswordError={setShowPasswordError}
          >
            <Input
              id="change-password-form-new-password"
              type={newPasswordType}
              name="new"
              placeholder={t('newPassword') || ''}
              autoComplete="new-password"
              showError={showPasswordError}
              onFocus={() => {
                setShowPasswordError(false);
              }}
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
            id="change-password-form-confirm-password"
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

          <DisplaySystemMessage
            errorMessage={error?.evaluatedMessage}
            successMessage={isSuccess ? t('success') : null}
          />

          <BaseButton type="submit" variant="contained" isLoading={isLoading} text={t('submit')} />
        </Box>
      </BasicFormProvider>
    </Container>
  );
};
