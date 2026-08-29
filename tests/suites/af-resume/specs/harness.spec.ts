import { expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';
import { getEntityProgress, getGroupProgress, clearAllLocalProgress } from '../../../utils/local-progress';

// Checks that the af-resume test setup itself works, before real tests use it.
test.describe('AF Resume harness', () => {
  test('authenticated session survives navigation to the protected area', async ({ page }) => {
    await page.goto('/protected/applets');
    // The header shows the logged-in user's name only when /users/me succeeds.
    await expect(page.getByRole('button', { name: /AF Worker/ })).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/.*\/protected\/applets/);
  });

  test('LaunchDarkly mock serves EnableFlowResume to the app', async ({ page }) => {
    const ldResponse = page.waitForResponse(
      (response) => response.url().includes('/sdk/eval'),
      { timeout: 15000 },
    );

    await page.goto('/protected/applets');

    const flags = (await (await ldResponse).json()) as Record<string, { value: unknown }>;
    expect(flags.enableFlowResume.value).toEqual(['*']);
  });

  test('applet factory creates the AF Resume applet visible in the UI', async ({
    afApplet,
    page,
  }) => {
    expect(afApplet.flowActivityIds).toHaveLength(3);
    expect(afApplet.standaloneActivityIds).toHaveLength(2);

    await page.goto('/protected/applets');
    await expect(page.getByText(afApplet.displayName)).toBeVisible({ timeout: 15000 });
  });

  test('event client can create and delete a scheduled event for the flow', async ({
    afApplet,
    afApi,
  }) => {
    const created = await afApi.events.createScheduledEvent(
      afApplet.appletId,
      { flowId: afApplet.flowId },
      { type: 'DAILY' },
    );
    expect(created.result.id).toBeTruthy();

    const events = await afApi.events.getEvents(afApplet.appletId);
    const ids = events.result.map((e: { id: string }) => e.id);
    expect(ids).toContain(created.result.id);

    await afApi.events.deleteEvent(afApplet.appletId, created.result.id);
  });

  test('survey driver creates local progress the storage helpers can read and clear', async ({
    afApplet,
    afApi,
    cards,
    survey,
    page,
  }) => {
    const events = await afApi.events.getEvents(afApplet.appletId);
    const flowEvent = events.result.find(
      (e: { flowId: string | null }) => e.flowId === afApplet.flowId,
    );

    await page.goto('/protected/applets');
    await page.getByText(afApplet.displayName).click();
    const startButton = cards.startButton(cards.flowCard('AF Resume Flow'));
    // Retry the click: React may not have attached handlers on first paint.
    await expect(async () => {
      await startButton.click();
      await expect(survey.saveAndExitButton).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 15000 });

    // Finish activity 1; the flow advances to activity 2's welcome screen.
    await survey.completeCurrentActivity();
    await expect(page.getByText('Activity 2 • 1 Question')).toBeVisible({ timeout: 15000 });

    const progress = await getEntityProgress(page, afApplet.flowId, flowEvent.id);
    expect(progress, 'flow progress should be tracked locally').toBeTruthy();
    expect(progress.type).toBeTruthy();

    await clearAllLocalProgress(page);
    expect(Object.keys(await getGroupProgress(page))).toHaveLength(0);
  });
});
