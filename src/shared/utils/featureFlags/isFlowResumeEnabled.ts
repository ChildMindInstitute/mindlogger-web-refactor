import { FeatureFlagType, FeatureFlag } from '../types/featureFlags';

export const isFlowResumeEnabled = (
  flag: FeatureFlagType[FeatureFlag.EnableFlowResume],
  appletId: string,
): boolean => {
  return flag === true || (Array.isArray(flag) && flag.includes(appletId));
};
