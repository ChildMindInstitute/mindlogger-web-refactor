import { test as base } from '@playwright/test';

import { AF_RESUME_ALL_APPLETS, mockFeatureFlags, MockedFlagValues } from '../utils/feature-flags';

type FlagsFixtures = {
  // Override with test.use({ mockedFlags: {...} }) to change flag values.
  mockedFlags: MockedFlagValues;
};

export const test = base.extend<FlagsFixtures>({
  mockedFlags: [AF_RESUME_ALL_APPLETS, { option: true }],

  // Auto-install the LD mock on every context before the page loads.
  context: async ({ context, mockedFlags }, use) => {
    await mockFeatureFlags(context, mockedFlags);
    await use(context);
  },
});

export { expect } from '@playwright/test';
