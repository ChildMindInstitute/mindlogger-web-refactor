import { memo, useEffect, useRef, ChangeEvent } from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useController } from 'react-hook-form';

import { useMFAContext } from '../lib/MFAContext';
import { useMFAVerification } from '../lib/useMFAVerification';
import { MFARecoveryCodeSchema, TMFARecoveryCodeForm } from '../model/mfa.schema';

import { variables } from '~/shared/constants/theme/variables';
import { BaseButton, BasicFormProvider, Box, Text } from '~/shared/ui';
import { useCustomForm, useCustomTranslation } from '~/shared/utils';

interface RecoveryCodeFormProps {
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
 * Consumes MFA session from context (isolated state).
 * Error state is local to useMFAVerification (API-driven).
 * Shows "Back to Login" only when session is expired.
 */
const RecoveryCodeFormComponent = ({
  onSuccess,
  onSwitchToTOTP,
  onBackToLogin,
}: RecoveryCodeFormProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'MFA' });
  const isUserTypingRef = useRef(false);

  // Get session from context - isolated from parent
  const { session, incrementAttempts } = useMFAContext();

  const form = useCustomForm<typeof MFARecoveryCodeSchema>(
    { defaultValues: { code: '' }, mode: 'onSubmit', reValidateMode: 'onSubmit' },
    MFARecoveryCodeSchema,
  );
  const { handleSubmit, setValue, watch, control } = form;

  const { displayError, isSessionExpired, isSubmitting, verifyCode, clearError } =
    useMFAVerification({
      type: 'recovery',
      session,
      onIncrementAttempts: incrementAttempts,
      onSuccess,
    });

  const code = watch('code');

  // Auto-format recovery code: XXXXX-XXXXX
  const formatRecoveryCode = (value: string): string => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleaned.length > 5) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 10)}`;
    }
    return cleaned;
  };

  // Clear error when user is typing
  useEffect(() => {
    if (displayError && code.length > 0 && isUserTypingRef.current) {
      clearError();
    }
  }, [code, displayError, clearError]);

  const onSubmit = async (data: TMFARecoveryCodeForm) => {
    if (isSessionExpired) return;
    isUserTypingRef.current = false;
    const success = await verifyCode(data.code);
    if (!success) {
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
    <Box display="flex" flexDirection="column" alignItems="center" gap="32px" width="100%">
      <Box display="flex" flexDirection="column" alignItems="center" gap="8px">
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
      </Box>

      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" gap="24px" width="100%">
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

          {/* Show "Back to authenticator" when NOT expired */}
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

          {/* Show "Back to Login" ONLY when session expired */}
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
        </Box>
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
          maxLength: 11,
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
