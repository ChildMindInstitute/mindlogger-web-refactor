import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';

import { FeatureFlags, FeatureFlagsKeys } from '../types/featureFlags';

/**
 * Internal wrapper for LaunchDarkly's hooks and flags.
 */
export const useFeatureFlags = () => {
  const ldClient = useLDClient();
  const flags = useFlags();

  /**
   * Resets the active context back to an anonymous user account.
   */
  const resetContext = () => {
    void ldClient?.identify({
      kind: 'user',
      anonymous: true,
    });
  };

  const featureFlags = () => {
    const keys = Object.keys(FeatureFlagsKeys) as (keyof typeof FeatureFlagsKeys)[];
    const features: FeatureFlags = {};
    // We're assigning a known list of flags, safe to ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    keys.forEach((key) => (features[key] = flags[FeatureFlagsKeys[key]]));

    return features;
  };

  return { resetContext, featureFlags: featureFlags() };
};
