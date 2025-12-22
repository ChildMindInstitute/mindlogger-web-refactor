import { memo, useEffect, useRef, ChangeEvent } from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useController } from 'react-hook-form';

import { useMFAVerification } from '../lib/useMFAVerification';
import { MFATOTPSchema, TMFATOTPForm } from '../model/mfa.schema';
import { MFAState, MFAAction } from '../model/mfa.types';

import { variables } from '~/shared/constants/theme/variables';
import { BaseButton, BasicFormProvider, Box, Text } from '~/shared/ui';
import { useCustomForm, useCustomTranslation } from '~/shared/utils';

interface MFAFormProps {
  mfaState: MFAState;
  dispatch: React.Dispatch<MFAAction>;
  onSuccess: (result: {
    user: { id: string; firstName: string; lastName: string; email: string };
    tokens: { accessToken: string; refreshToken: string; tokenType: string };
    password: string;
  }) => void;
  onSwitchToRecovery: () => void;
  onBackToLogin: () => void;
}

/**
 * MFA TOTP Form Component
 *
 * Features:
 * - 6-digit numeric input with letter-spacing for readability
 * - Auto-submit when 6 digits are entered
 * - Sanitizes input to digits only
 * - Displays error messages with remaining attempts
 * - "Can't access authenticator" link for recovery code fallback
 */
const MFAFormComponent = ({
  mfaState,
  dispatch,
  onSuccess,
  onSwitchToRecovery,
  onBackToLogin,
}: MFAFormProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'MFA' });
  const formRef = useRef<HTMLFormElement>(null);
  const isUserTypingRef = useRef(false);

  const form = useCustomForm<typeof MFATOTPSchema>(
    { defaultValues: { totpCode: '' } },
    MFATOTPSchema,
  );
  const { handleSubmit, setValue, watch, control } = form;

  const { error, displayError, isSessionExpired, isSubmitting, verifyCode, clearError, cleanup } =
    useMFAVerification({
      type: 'totp',
      mfaState,
      dispatch,
      onSuccess,
    });

  const totpCode = watch('totpCode');

  // Sanitize TOTP input to digits only, max 6
  const sanitizeTotp = (raw: string) => raw.replace(/\D/g, '').slice(0, 6);

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (totpCode.length === 6 && /^\d{6}$/.test(totpCode) && !isSubmitting && !isSessionExpired) {
      formRef.current?.requestSubmit();
    }
  }, [totpCode, isSubmitting, isSessionExpired]);

  // Clear error only when user is typing
  useEffect(() => {
    if (error && totpCode.length > 0 && isUserTypingRef.current) {
      clearError();
    }
  }, [totpCode, error, clearError]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  const onSubmit = async (data: TMFATOTPForm) => {
    if (isSessionExpired) return;
    isUserTypingRef.current = false;
    const success = await verifyCode(data.totpCode);
    if (!success) {
      // Clear input on error so user can try again
      setValue('totpCode', '');
    }
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    isUserTypingRef.current = true;
    const sanitized = sanitizeTotp(e.target.value);
    setValue('totpCode', sanitized);
  };

  // Get error message for display
  const getErrorMessage = (): string | null => {
    if (displayError) {
      if (displayError.includes('|')) {
        const [key, remaining] = displayError.split('|');
        return `${t(key)}. ${t('attemptsRemaining', { count: parseInt(remaining) })}`;
      }
      return t(displayError);
    }
    return null;
  };

  const helperMessage = getErrorMessage();

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
        {t('enterVerificationCode')}
      </Text>

      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <form
          ref={formRef}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TOTPInput
            control={control}
            onChange={handleCodeChange}
            disabled={isSessionExpired}
            error={!!helperMessage}
            helperText={helperMessage || undefined}
          />

          <Box display="flex" justifyContent="center">
            <button
              type="button"
              onClick={onSwitchToRecovery}
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                color: variables.palette.primary,
                fontSize: 'inherit',
                fontFamily: 'inherit',
              }}
            >
              {t('cantAccessAuthenticator')}
            </button>
          </Box>

          <BaseButton
            type="submit"
            variant="contained"
            isLoading={isSubmitting}
            disabled={isSessionExpired}
            text={t('continue')}
          />

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
        </form>
      </BasicFormProvider>
    </Box>
  );
};

// Separate TOTP input component with letter-spacing styling
interface TOTPInputProps {
  control: ReturnType<typeof useCustomForm>['control'];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  error: boolean;
  helperText?: string;
}

const TOTPInput = ({ control, onChange, disabled, error, helperText }: TOTPInputProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'MFA' });
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name: 'totpCode', control });

  const displayError = error || !!fieldError;
  const displayHelperText = helperText || (fieldError?.message ? t(fieldError.message) : undefined);

  return (
    <FormControl error={displayError} sx={{ width: '100%' }} variant="outlined">
      <InputLabel>{t('verificationCode')}</InputLabel>
      <OutlinedInput
        {...field}
        label={t('verificationCode')}
        type="text"
        onChange={onChange}
        disabled={disabled}
        inputProps={{
          maxLength: 6,
          inputMode: 'numeric',
          pattern: '[0-9]*',
          autoComplete: 'one-time-code',
          style: { letterSpacing: '0.5em', fontSize: '1.25rem', textAlign: 'center' },
        }}
        autoFocus
        error={displayError}
      />
      {displayHelperText && <FormHelperText>{displayHelperText}</FormHelperText>}
    </FormControl>
  );
};

export const MFAForm = memo(MFAFormComponent);
MFAForm.displayName = 'MFAForm';
