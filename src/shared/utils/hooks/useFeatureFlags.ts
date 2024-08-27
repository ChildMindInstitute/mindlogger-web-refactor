import { useFlags } from 'launchdarkly-react-client-sdk';

import { FeatureFlags, FeatureFlagsKeys } from '../types/featureFlags';

/**
 * Internal wrapper for LaunchDarkly's hooks and flags.
 */
export const useFeatureFlags = () => {
  const flags = useFlags();

  const featureFlags = () => {
    const keys = Object.keys(FeatureFlagsKeys) as (keyof typeof FeatureFlagsKeys)[];
    const features: FeatureFlags = {};
    // We're assigning a known list of flags, safe to ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    keys.forEach((key) => (features[key] = flags[FeatureFlagsKeys[key]]));

    features.enableActivityAssign = false;
    return features;
  };

  return { featureFlags: featureFlags() };
};
