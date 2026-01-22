import { memo, useEffect, useRef, useCallback, ChangeEvent } from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useController } from 'react-hook-form';

import { useMFAVerification } from '../lib/useMFAVerification';
import { MFATOTPSchema, TMFATOTPForm } from '../model/mfa.schema';

import { variables } from '~/shared/constants/theme/variables';
import { BaseButton, BasicFormProvider, Box, Text } from '~/shared/ui';
import { useCustomForm, useCustomTranslation } from '~/shared/utils';
import { Mixpanel } from '~/shared/utils/analytics';
import { MixpanelEventType, MixpanelProps } from '~/shared/utils/analytics/mixpanel.types';

interface MFAFormProps {
  /** MFA session from Redux (passed via props) */
  session: { token: string; sessionId: string };
  /**
   * Called on successful verification - tokens are already stored.
   * Only receives user data since tokens are stored in useMFAVerification
   * before this callback to avoid race conditions with navigation.
   */
  onSuccess: (result: {
    user: { id: string; firstName: string; lastName: string; email: string };
  }) => void;
  onSwitchToRecovery: () => void;
  onBackToLogin: () => void;
}

/**
 * MFA TOTP Form Component
 *
 * Receives MFA session via props (from Redux).
 * Error state is local to useMFAVerification (API-driven).
 * Private key is already stored before navigation to this page.
 */
const MFAFormComponent = ({
  session,
  onSuccess,
  onSwitchToRecovery,
  onBackToLogin,
}: MFAFormProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'MFA' });
  const isUserTypingRef = useRef(false);
  const isAutoSubmittingRef = useRef(false);

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

  // Track page view and challenge presented on mount
  useEffect(() => {
    Mixpanel.trackPageView('MFA Verification');
    Mixpanel.track({
      action: MixpanelEventType.MFAChallengePresented,
      [MixpanelProps.MFAType]: 'totp',
    });
  }, []);

  // Sanitize TOTP input to digits only, max 6
  const sanitizeTotp = (raw: string) => raw.replace(/\D/g, '').slice(0, 6);

  const onSubmit = useCallback(
    async (data: TMFATOTPForm) => {
      if (isSessionExpired) return;
      const wasAutoSubmit = isAutoSubmittingRef.current;
      isUserTypingRef.current = false;

      Mixpanel.track({
        action: MixpanelEventType.MFATOTPCodeSubmitted,
        [MixpanelProps.MFAIsAutoSubmit]: wasAutoSubmit,
      });

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

  const handleSwitchToRecovery = () => {
    Mixpanel.track({ action: MixpanelEventType.MFASwitchToRecovery });
    onSwitchToRecovery();
  };

  const handleBackToLogin = () => {
    Mixpanel.track({ action: MixpanelEventType.MFABackToLogin });
    onBackToLogin();
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
        <Text variant="headlineSmall" color={variables.palette.onSurface}>
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
            <Text
              variant="bodyLarge"
              color={variables.palette.primary}
              onClick={handleSwitchToRecovery}
              sx={{
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              {t('cantAccessAuthenticator')}
            </Text>
          </Box>

          <Box display="flex" justifyContent="center">
            <Text
              variant="bodyLarge"
              color={variables.palette.onSurfaceVariant}
              onClick={handleBackToLogin}
              sx={{
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
            >
              {t('backToLogin')}
            </Text>
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
