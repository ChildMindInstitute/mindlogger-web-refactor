import { authorizationService, MutationOptions, useBaseMutation } from '~/shared/api';

type Options = MutationOptions<typeof authorizationService.verifyMFARecoveryCode>;

/**
 * Hook for verifying MFA recovery code
 * Used when user cannot access their authenticator app and uses backup code
 */
export const useMFARecoveryMutation = (options?: Options) => {
  return useBaseMutation(['mfa-verify-recovery'], authorizationService.verifyMFARecoveryCode, {
    ...options,
  });
};
