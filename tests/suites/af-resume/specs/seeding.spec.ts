import crypto from 'node:crypto';

import { expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';

// Proves that answers seeded through the API look the same as answers from a real device.
test.describe('AF Resume answer seeding', () => {
  test('API-seeded partial flow progress reaches the server and surfaces in the web UI', async ({
    afApplet,
    afApi,
    page,
  }) => {
    // The backend auto-creates a default Always Available event per entity.
    const events = await afApi.events.getEvents(afApplet.appletId);
    const flowEvent = events.result.find(
      (e: { flowId: string | null }) => e.flowId === afApplet.flowId,
    );
    expect(flowEvent, 'default AA event for the flow should exist').toBeTruthy();

    // Seed 2 of 3 flow activities under one submission.
    const submitId = crypto.randomUUID();
    await afApi.answers.seedFlowProgress(afApplet, 2, {
      submitId,
      eventId: flowEvent.id,
      eventVersion: flowEvent.version,
    });

    // Server view: the submission exists and is still in progress.
    const fromDate = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10);
    const completions = (
      await afApi.answers.getCompletedEntities(afApplet.appletId, afApplet.version, fromDate)
    ).result;
    const seeded = completions.activityFlows.filter(
      (f: { submitId: string }) => f.submitId === submitId,
    );
    expect(seeded.length).toBeGreaterThan(0);
    expect(seeded.some((f: { isFlowCompleted: boolean | null }) => f.isFlowCompleted)).toBe(false);

    // Web view: the flow card shows seeded progress with Resume/Restart controls.
    await page.goto('/protected/applets');
    await page.getByText(afApplet.displayName).click();
    await expect(page.getByText('2 of 3 activities completed')).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: 'Resume', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /restart/i })).toBeVisible();
  });
});
