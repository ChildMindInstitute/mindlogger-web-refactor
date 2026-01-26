import { authorizationService, MutationOptions, useBaseMutation } from '~/shared/api';

type Options = MutationOptions<typeof authorizationService.verifyMFATOTP>;

/**
 * Hook for verifying MFA TOTP (Time-based One-Time Password) code
 * Used when user enters 6-digit code from authenticator app
 */
export const useMFAVerifyMutation = (options?: Options) => {
  return useBaseMutation(['mfa-verify-totp'], authorizationService.verifyMFATOTP, { ...options });
};
