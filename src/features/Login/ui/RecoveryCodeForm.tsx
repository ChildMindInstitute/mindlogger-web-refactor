import { memo, useEffect, useRef, ChangeEvent } from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useController } from 'react-hook-form';

import { useMFAVerification } from '../lib/useMFAVerification';
import { MFARecoveryCodeSchema, TMFARecoveryCodeForm } from '../model/mfa.schema';

import { variables } from '~/shared/constants/theme/variables';
import { BaseButton, BasicFormProvider, Box, Text } from '~/shared/ui';
import { useCustomForm, useCustomTranslation } from '~/shared/utils';
import { Mixpanel } from '~/shared/utils/analytics';
import { MixpanelEventType, MixpanelProps } from '~/shared/utils/analytics/mixpanel.types';

interface RecoveryCodeFormProps {
  /** MFA session from Redux (passed via props) */
  session: { token: string; sessionId: string };
  /**
   * Called on successful verification - tokens are already stored.
   * Only receives user data and MFA context since tokens are stored in useMFAVerification
   * before this callback to avoid race conditions with navigation.
   */
  onSuccess: (result: {
    user: { id: string; firstName: string; lastName: string; email: string };
    mfaUsed: boolean;
    mfaMethod: 'Authenticator App' | 'Backup Codes';
  }) => void;
  onSwitchToTOTP: () => void;
  onBackToLogin: () => void;
}

/**
 * MFA Recovery Code Form Component
 *
 * Receives MFA session via props (from Redux).
 * Error state is local to useMFAVerification (API-driven).
 * Private key is already stored before navigation to this page.
 * Shows "Back to Login" only when session is expired.
 */
const RecoveryCodeFormComponent = ({
  session,
  onSuccess,
  onSwitchToTOTP,
  onBackToLogin,
}: RecoveryCodeFormProps) => {
  const { t } = useCustomTranslation({ keyPrefix: 'MFA' });
  const isUserTypingRef = useRef(false);

  const form = useCustomForm<typeof MFARecoveryCodeSchema>(
    { defaultValues: { code: '' }, mode: 'onSubmit', reValidateMode: 'onSubmit' },
    MFARecoveryCodeSchema,
  );
  const { handleSubmit, setValue, watch, control } = form;

  const { displayError, isSessionExpired, isSubmitting, verifyCode, clearError } =
    useMFAVerification({
      type: 'recovery',
      session,
      onSuccess,
    });

  const code = watch('code');

  // Track page view and challenge presented on mount
  useEffect(() => {
    Mixpanel.trackPageView('MFA Recovery');
    Mixpanel.track({
      action: MixpanelEventType.MFAChallengePresented,
      [MixpanelProps.MFAType]: 'recovery',
    });
  }, []);

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

    Mixpanel.track({ action: MixpanelEventType.MFARecoveryCodeSubmitted });

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

  const handleSwitchToTOTP = () => {
    Mixpanel.track({ action: MixpanelEventType.MFASwitchToTOTP });
    onSwitchToTOTP();
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
      // New format: "invalidRecoveryCode|global|5" or "invalidRecoveryCode|session|2"
      const [key, warningType, remaining] = parts;
      const count = parseInt(remaining);

      if (warningType === 'global') {
        return `${t(key)}. ${t('globalAttemptsRemaining', { count })}`;
      }
      return `${t(key)}. ${t('sessionAttemptsRemaining', { count })}`;
    }

    if (parts.length === 2) {
      // Legacy format: "invalidRecoveryCode|2"
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
          {t('enterRecoveryCode')}
        </Text>
      </Box>

      <BasicFormProvider {...form} onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" alignItems="center" gap="24px" width="100%">
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
            sx={{ width: '300px', height: '48px' }}
          />

          {/* Show "Back to authenticator" when NOT expired */}
          {!isSessionExpired && (
            <Box display="flex" justifyContent="center">
              <Text
                variant="bodyLarge"
                color={variables.palette.onSurfaceVariant}
                onClick={handleSwitchToTOTP}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                {t('backToAuthenticator')}
              </Text>
            </Box>
          )}

          {/* Show "Back to Login" ONLY when session expired */}
          {isSessionExpired && (
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
  const { t: tValidation } = useCustomTranslation();
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name: 'code', control });

  const displayError = error || !!fieldError;
  const displayHelperText =
    helperText || (fieldError?.message ? tValidation(fieldError.message) : undefined);

  return (
    <FormControl error={displayError} variant="outlined" sx={{ width: '300px' }}>
      <InputLabel>{t('recoveryCode')}</InputLabel>
      <OutlinedInput
        {...field}
        label={t('recoveryCode')}
        type="text"
        onChange={onChange}
        disabled={disabled}
        sx={{ width: '100%' }}
        inputProps={{
          maxLength: 11,
          autoComplete: 'off',
          style: { letterSpacing: '0.3em', fontSize: '1rem', textAlign: 'center' },
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
