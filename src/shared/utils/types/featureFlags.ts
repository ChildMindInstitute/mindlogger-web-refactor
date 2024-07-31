import { LDFlagValue } from 'launchdarkly-react-client-sdk';

// These keys use the camelCase representation of the feature flag value
// e.g. enable-participant-multi-informant in LaunchDarky becomes enableParticipantMultiInformant
export const FeatureFlagsKeys = {
  enableParticipantMultiInformant: 'enableParticipantMultiInformant',
};

export type FeatureFlags = Partial<Record<keyof typeof FeatureFlagsKeys, LDFlagValue>>;
