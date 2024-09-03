export enum FeatureFlag {
  EnableParticipantMultiInformant = 'EnableParticipantMultiInformant',
  EnablePhrasalTemplate = 'EnablePhrasalTemplate',
  EnableActivityAssign = 'EnableActivityAssign',
}

export type FeatureFlagType = {
  [FeatureFlag.EnableParticipantMultiInformant]: boolean;
  [FeatureFlag.EnablePhrasalTemplate]: boolean;
  [FeatureFlag.EnableActivityAssign]: boolean;
};

// Mapping between the feature flag we want to use in code, to the
// representation of LaunchDarky's feature flag key through LaunchDarky API.
// The keys in LaunchDarky are in kabab-case, and through the LaunchDarky API,
// those keys are represented as camel-case.
// For example, a feature flag in LaunchDarky may be called `my-feature`, but
// that key is exposed through LaunchDarky as `myFeature`.
// So, the "key" of this mapping dictionary is the name of the feature flag we
// want to use in code; and the "value" of this mapping dictionary is the name
// of the feature flag exposed through LaunchDarky API.
export const LaunchDarkyFlagsMap = {
  [FeatureFlag.EnableParticipantMultiInformant]: 'enableParticipantMultiInformant',
  [FeatureFlag.EnablePhrasalTemplate]: 'enablePhrasalTemplate',

  // TODO: https://mindlogger.atlassian.net/browse/M2-6518 Assign Activity flag cleanup
  [FeatureFlag.EnableActivityAssign]: 'enableActivityAssign',
};
