import { useMemo } from 'react';

import { LDFlagValue } from 'launchdarkly-react-client-sdk';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { LaunchDarkyFlagsMap, FeatureFlag, FeatureFlagType } from '../types/featureFlags';

/**
 * Internal wrapper for LaunchDarkly's hooks and flags.
 */
export const useFeatureFlags = () => {
  const flags = useFlags();

  const featureFlags = useMemo(() => {
    return Object.entries(LaunchDarkyFlagsMap).reduce(
      (acc, [flag, ldFlag]) => {
        acc[flag] = flags[ldFlag] as unknown;
        return acc;
      },
      {} as Partial<Record<string, LDFlagValue>>,
    );
  }, [flags]);

  const featureFlag = <TFlag extends FeatureFlag, TValue = FeatureFlagType[TFlag]>(
    flag: TFlag,
    fallbackValue: NoInfer<TValue>,
  ): TValue => {
    const flagValue = featureFlags[flag] as TValue | null | undefined;
    return flagValue === null || flagValue === undefined ? fallbackValue : flagValue;
  };

  return {
    featureFlag,

    /**
     * @deprecated Use generic function `featureFlag` instead.
     */
    featureFlags,
  };
};
