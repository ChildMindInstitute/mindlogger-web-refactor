import { z } from 'zod';

import { Dictionary } from '~/shared/utils';

/**
 * TOTP (Time-based One-Time Password) Schema
 * Validates 6-digit verification code from authenticator app
 */
export const MFATOTPSchema = z.object({
  totpCode: z
    .string()
    .min(1, Dictionary.validation.mfa.codeRequired)
    .regex(/^\d{6}$/, Dictionary.validation.mfa.codeFormat),
});

export type TMFATOTPForm = z.infer<typeof MFATOTPSchema>;

/**
 * Recovery Code Schema
 * Validates XXXXX-XXXXX format (alphanumeric, uppercase)
 */
export const MFARecoveryCodeSchema = z.object({
  code: z
    .string()
    .min(1, Dictionary.validation.mfa.recoveryCodeRequired)
    .regex(/^[A-Z0-9]{5}-[A-Z0-9]{5}$/, Dictionary.validation.mfa.recoveryCodeFormat),
});

export type TMFARecoveryCodeForm = z.infer<typeof MFARecoveryCodeSchema>;
