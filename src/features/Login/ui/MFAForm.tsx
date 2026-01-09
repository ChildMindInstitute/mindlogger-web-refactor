import { memo, useEffect, useRef, useCallback, ChangeEvent } from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useController } from 'react-hook-form';

import { useMFAContext } from '../lib/MFAContext';
import { useMFAVerification } from '../lib/useMFAVerification';
import { MFATOTPSchema, TMFATOTPForm } from '../model/mfa.schema';

import { variables } from '~/shared/constants/theme/variables';
import { BaseButton, BasicFormProvider, Box, Text } from '~/shared/ui';
import { useCustomForm, useCustomTranslation } from '~/shared/utils';

interface MFAFormProps {
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
 * Consumes MFA session from context (isolated state).
 * Error state is local to useMFAVerification (API-driven).
 * Parent components won't re-render on MFA errors.
 */
const MFAFormComponent = ({ onSuccess, onSwitchToRecovery, onBackToLogin }: MFAFormProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'MFA' });
  const isUserTypingRef = useRef(false);
  const isAutoSubmittingRef = useRef(false);

  // Get session from context - isolated from parent
  const { session } = useMFAContext();

  const form = useCustomForm<typeof MFATOTPSchema>(
    { defaultValues: { totpCode: '' }, mode: 'onSubmit', reValidateMode: 'onSubmit' },
    MFATOTPSchema,
  );
  const { handleSubmit, setValue, watch, control } = form;

  const { displayError, isSessionExpired, isSubmitting, verifyCode, clearError } =
    useMFAVerification({
      type: 'totp',
      session,
      onSuccess,
    });

  const totpCode = watch('totpCode');

  // Sanitize TOTP input to digits only, max 6
  const sanitizeTotp = (raw: string) => raw.replace(/\D/g, '').slice(0, 6);

  const onSubmit = useCallback(
    async (data: TMFATOTPForm) => {
      if (isSessionExpired) return;
      isUserTypingRef.current = false;
      const success = await verifyCode(data.totpCode);
      if (!success) {
        setValue('totpCode', '');
      }
      isAutoSubmittingRef.current = false;
    },
    [isSessionExpired, verifyCode, setValue],
  );

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (
      totpCode.length === 6 &&
      /^\d{6}$/.test(totpCode) &&
      !isSubmitting &&
      !isSessionExpired &&
      !isAutoSubmittingRef.current
    ) {
      isAutoSubmittingRef.current = true;
      void handleSubmit(onSubmit)();
    }
  }, [totpCode, isSubmitting, isSessionExpired, handleSubmit, onSubmit]);

  // Clear error only when user is typing
  useEffect(() => {
    if (displayError && totpCode.length > 0 && isUserTypingRef.current) {
      clearError();
    }
  }, [totpCode, displayError, clearError]);

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    isUserTypingRef.current = true;
    const sanitized = sanitizeTotp(e.target.value);
    setValue('totpCode', sanitized);
  };

  // Get error message for display
  // Supports formats: "key", "key|count" (legacy), "key|type|count" (new)
  const getErrorMessage = (): string | null => {
    if (!displayError) return null;

    const parts = displayError.split('|');

    if (parts.length === 3) {
      // New format: "invalidCode|global|5" or "invalidCode|session|2"
      const [key, warningType, remaining] = parts;
      const count = parseInt(remaining);

      if (warningType === 'global') {
        return `${t(key)}. ${t('globalAttemptsRemaining', { count })}`;
      }
      return `${t(key)}. ${t('sessionAttemptsRemaining', { count })}`;
    }

    if (parts.length === 2) {
      // Legacy format: "invalidCode|2"
      const [key, remaining] = parts;
      return `${t(key)}. ${t('attemptsRemaining', { count: parseInt(remaining) })}`;
    }

    // Simple key only
    return t(displayError);
  };

  const helperMessage = getErrorMessage();

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
          {t('enterVerificationCode')}
        </Text>
      </Box>

      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" alignItems="center" gap="24px" width="100%">
          <TOTPInput
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
            sx={{ width: '300px', height: '48px' }}
          />

          <Box display="flex" justifyContent="center">
            <BaseButton
              type="button"
              variant="text"
              onClick={onSwitchToRecovery}
              text={t('cantAccessAuthenticator')}
              sx={{
                color: variables.palette.primary,
                padding: 0,
                minWidth: 'auto',
                '&:hover': { backgroundColor: 'transparent' },
              }}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <BaseButton
              type="button"
              variant="text"
              onClick={onBackToLogin}
              text={t('backToLogin')}
              sx={{
                color: variables.palette.onSurfaceVariant,
                padding: 0,
                minWidth: 'auto',
                '&:hover': { backgroundColor: 'transparent' },
              }}
            />
          </Box>
        </Box>
      </BasicFormProvider>
    </Box>
  );
};

// Separate TOTP input component
interface TOTPInputProps {
  control: ReturnType<typeof useCustomForm>['control'];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  error: boolean;
  helperText?: string;
}

const TOTPInput = ({ control, onChange, disabled, error, helperText }: TOTPInputProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'MFA' });
  const { t: tValidation } = useCustomTranslation();
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name: 'totpCode', control });

  const displayError = error || !!fieldError;
  const displayHelperText =
    helperText || (fieldError?.message ? tValidation(fieldError.message) : undefined);

  return (
    <FormControl error={displayError} variant="outlined" sx={{ width: '300px' }}>
      <InputLabel>{t('verificationCode')}</InputLabel>
      <OutlinedInput
        {...field}
        label={t('verificationCode')}
        type="text"
        onChange={onChange}
        disabled={disabled}
        sx={{ width: '100%' }}
        inputProps={{
          maxLength: 6,
          inputMode: 'numeric',
          pattern: '[0-9]*',
          autoComplete: 'one-time-code',
          style: { letterSpacing: '0.3em', fontSize: '1rem', textAlign: 'center' },
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
