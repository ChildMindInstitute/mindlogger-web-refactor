import { memo, useEffect, useRef, ChangeEvent } from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useController } from 'react-hook-form';

import { useMFAVerification } from '../lib/useMFAVerification';
import { MFARecoveryCodeSchema, TMFARecoveryCodeForm } from '../model/mfa.schema';
import { MFAState, MFAAction } from '../model/mfa.types';

import { variables } from '~/shared/constants/theme/variables';
import { BaseButton, BasicFormProvider, Box, Text } from '~/shared/ui';
import { useCustomForm, useCustomTranslation } from '~/shared/utils';

interface RecoveryCodeFormProps {
  mfaState: MFAState;
  dispatch: React.Dispatch<MFAAction>;
  onSuccess: (result: {
    user: { id: string; firstName: string; lastName: string; email: string };
    tokens: { accessToken: string; refreshToken: string; tokenType: string };
    password: string;
  }) => void;
  onSwitchToTOTP: () => void;
  onBackToLogin: () => void;
}

/**
 * MFA Recovery Code Form Component
 *
 * Features:
 * - XXXXX-XXXXX format input (alphanumeric, uppercase)
 * - Auto-format: converts to uppercase and inserts hyphen after 5 chars
 * - "Back to authenticator" link to return to TOTP form
 * - Displays error messages
 */
const RecoveryCodeFormComponent = ({
  mfaState,
  dispatch,
  onSuccess,
  onSwitchToTOTP,
  onBackToLogin,
}: RecoveryCodeFormProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'MFA' });
  const isUserTypingRef = useRef(false);

  const form = useCustomForm<typeof MFARecoveryCodeSchema>(
    { defaultValues: { code: '' } },
    MFARecoveryCodeSchema,
  );
  const { handleSubmit, setValue, watch, control } = form;

  const { error, displayError, isSessionExpired, isSubmitting, verifyCode, clearError, cleanup } =
    useMFAVerification({
      type: 'recovery',
      mfaState,
      dispatch,
      onSuccess,
    });

  const code = watch('code');

  // Auto-format recovery code: XXXXX-XXXXX
  const formatRecoveryCode = (value: string): string => {
    // Remove all non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

    // Add hyphen after 5 characters if needed
    if (cleaned.length > 5) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 10)}`;
    }

    return cleaned;
  };

  // Clear error when user is typing
  useEffect(() => {
    if (error && code.length > 0 && isUserTypingRef.current) {
      clearError();
    }
  }, [code, error, clearError]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  const onSubmit = async (data: TMFARecoveryCodeForm) => {
    if (isSessionExpired) return;
    isUserTypingRef.current = false;
    const success = await verifyCode(data.code);
    if (!success) {
      // Clear input on error so user can try again
      setValue('code', '');
    }
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    isUserTypingRef.current = true;
    const formatted = formatRecoveryCode(e.target.value);
    setValue('code', formatted);
  };

  const helperMessage = displayError ? t(displayError) : null;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="24px" width="100%">
      <Text variant="titleLargeBold" color={variables.palette.onSurface}>
        {t('confirmYourIdentity')}
      </Text>
      <Text
        variant="bodyMedium"
        color={variables.palette.onSurfaceVariant}
        sx={{ textAlign: 'center' }}
      >
        {t('enterRecoveryCode')}
      </Text>

      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <form
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <RecoveryInput
            control={control}
            onChange={handleCodeChange}
            disabled={isSessionExpired}
            error={!!helperMessage}
            helperText={helperMessage || undefined}
          />

          <BaseButton
            type="submit"
            variant="contained"
            isLoading={isSubmitting}
            disabled={isSessionExpired}
            text={t('continue')}
          />

          {!isSessionExpired && (
            <Box display="flex" justifyContent="center">
              <button
                type="button"
                onClick={onSwitchToTOTP}
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: variables.palette.onSurfaceVariant,
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
              >
                {t('backToAuthenticator')}
              </button>
            </Box>
          )}

          {isSessionExpired && (
            <Box display="flex" justifyContent="center">
              <button
                type="button"
                onClick={onBackToLogin}
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: variables.palette.onSurfaceVariant,
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
              >
                {t('backToLogin')}
              </button>
            </Box>
          )}
        </form>
      </BasicFormProvider>
    </Box>
  );
};

// Separate Recovery code input component
interface RecoveryInputProps {
  control: ReturnType<typeof useCustomForm>['control'];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  error: boolean;
  helperText?: string;
}

const RecoveryInput = ({ control, onChange, disabled, error, helperText }: RecoveryInputProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'MFA' });
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name: 'code', control });

  const displayError = error || !!fieldError;
  const displayHelperText = helperText || (fieldError?.message ? t(fieldError.message) : undefined);

  return (
    <FormControl error={displayError} sx={{ width: '100%' }} variant="outlined">
      <InputLabel>{t('recoveryCode')}</InputLabel>
      <OutlinedInput
        {...field}
        label={t('recoveryCode')}
        type="text"
        onChange={onChange}
        disabled={disabled}
        inputProps={{
          maxLength: 11, // XXXXX-XXXXX
          autoComplete: 'off',
          style: { letterSpacing: '0.2em', fontSize: '1.1rem', textAlign: 'center' },
        }}
        autoFocus
        error={displayError}
      />
      {displayHelperText && <FormHelperText>{displayHelperText}</FormHelperText>}
    </FormControl>
  );
};

export const RecoveryCodeForm = memo(RecoveryCodeFormComponent);
RecoveryCodeForm.displayName = 'RecoveryCodeForm';
