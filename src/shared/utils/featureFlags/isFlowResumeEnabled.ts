import { FeatureFlagType, FeatureFlag } from '../types/featureFlags';

export const isFlowResumeEnabled = (
  flag: FeatureFlagType[FeatureFlag.EnableFlowResume],
  appletId: string,
): boolean => {
  return flag.includes('*') || flag.includes(appletId);
};
