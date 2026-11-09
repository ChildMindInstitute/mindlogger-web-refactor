import crypto from 'node:crypto';

import { expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';
import { AF_FLOW_NAME, getFlowEvent, openApplet, scheduleFlowDaily } from '../support';

// CD4: another device (e.g. mobile) completed the flow; web has no local progress.
test.describe('CD4: flow completed on another device', () => {
  test('CD4.1: Always Available flow shows no Resume and can be started again', {
    tag: '@CD4.1',
  }, async ({ afApplet, afApi, cards, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);
    await afApi.answers.completeFlow(afApplet, {
      submitId: crypto.randomUUID(),
      eventId: flowEvent.id,
      eventVersion: flowEvent.version,
    });

    // Wait for the server sync so the assertions see the synced state.
    const synced = page.waitForResponse((r) => r.url().includes('/completions'));
    await openApplet(page, afApplet);
    await synced;
    const card = cards.flowCard(AF_FLOW_NAME);
    await expect(cards.startButton(card)).toBeVisible({ timeout: 15000 });
    await expect(cards.resumeButton(card)).toHaveCount(0);
  });

  test('CD4.3: scheduled flow shows no Resume and is hidden', {
    tag: '@CD4.3',
  }, async ({ afApplet, afApi, cards, page }) => {
    const [event] = await scheduleFlowDaily(afApi, afApplet);
    await afApi.answers.completeFlow(afApplet, {
      submitId: crypto.randomUUID(),
      eventId: event.id,
      eventVersion: event.version,
    });

    const synced = page.waitForResponse((r) => r.url().includes('/completions'));
    await openApplet(page, afApplet);
    await synced;
    // The manual twin is never visible here, so wait on a standalone activity to know the list rendered.
    await expect(cards.activityCard('AF Standalone 1')).toBeVisible({ timeout: 15000 });
    await expect(cards.flowCard(AF_FLOW_NAME)).toHaveCount(0);
  });
});
