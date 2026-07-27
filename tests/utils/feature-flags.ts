import { BrowserContext, Page } from '@playwright/test';

// Flag keys as the app reads them from useFlags() (already camelCased).
export type MockedFlagValues = Record<string, unknown>;

export const AF_RESUME_ALL_APPLETS: MockedFlagValues = {
  enableFlowResume: ['*'],
};

const toEvalxBody = (flags: MockedFlagValues) =>
  JSON.stringify(
    Object.fromEntries(
      Object.entries(flags).map(([key, value], index) => [
        key,
        { value, version: 1, variation: index, trackEvents: false },
      ]),
    ),
  );

// Serves mocked LaunchDarkly flags for a page/context. Install before navigation.
export const mockFeatureFlags = async (
  target: Page | BrowserContext,
  flags: MockedFlagValues = AF_RESUME_ALL_APPLETS,
): Promise<void> => {
  await target.route('**/*.launchdarkly.com/**', async (route) => {
    const url = route.request().url();

    // Polling endpoint: answer with the mocked flags.
    if (url.includes('/sdk/evalx/') || url.includes('/sdk/eval/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: toEvalxBody(flags),
      });
      return;
    }

    // Streaming: reply once with the flags so the SDK stops retrying.
    if (url.includes('clientstream')) {
      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: `retry: 3600000\nevent: put\ndata: ${toEvalxBody(flags)}\n\n`,
      });
      return;
    }

    // Event uploads etc: succeed silently.
    await route.fulfill({ status: 202, contentType: 'application/json', body: '{}' });
  });
};
