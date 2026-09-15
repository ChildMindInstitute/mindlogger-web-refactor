import crypto from 'node:crypto';

import { expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';
import { openWebDevice } from '../../../fixtures/af-session.fixture';
import { ActivityCardPage } from '../../../pages/activity-card.page';
import {
  AF_MANUAL_FLOW_NAME,
  expectFlowResumeAt,
  getFlowEvent,
  openApplet,
  resumeAndExpectActivity,
  seedFlowProgress,
  setupAssignedRespondent,
} from '../support';

// CR1: server already has progress (2/3), this browser has none. The card must offer Resume at step 3.
test.describe('CR1: server in-progress, local empty', () => {
  test('CR1.1: progress appears without a page refresh (client-side navigation)', {
    tag: '@CR1.1',
  }, async ({ afApplet, afApi, cards, page }) => {
    // Seed progress on the server before this browser opens the applet.
    await page.goto('/protected/applets');
    await seedFlowProgress(afApi, afApplet, 2);

    // Entering the applet is pure client-side navigation, not a reload.
    await page.getByText(afApplet.displayName).click();
    await expectFlowResumeAt(cards, 2);
  });

  test('CR1.2: progress appears after refreshing the home page', {
    tag: '@CR1.2',
  }, async ({ afApplet, afApi, cards, page }) => {
    await page.goto('/protected/applets');
    await seedFlowProgress(afApi, afApplet, 2);

    await page.reload();
    await page.getByText(afApplet.displayName).click();
    await expectFlowResumeAt(cards, 2);
  });

  test('CR1.3: progress appears after refreshing the applet page and resumes at step 3', {
    tag: '@CR1.3',
  }, async ({ afApplet, afApi, cards, page }) => {
    await openApplet(page, afApplet);
    const { submitId } = await seedFlowProgress(afApi, afApplet, 2);

    await page.reload();
    await expectFlowResumeAt(cards, 2);

    // Extra check here only: Resume lands on activity 3 and finishes the same submission.
    await resumeAndExpectActivity(page, cards, 3);

    const fromDate = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10);
    const completions = (
      await afApi.answers.getCompletedEntities(afApplet.appletId, afApplet.version, fromDate)
    ).result;
    const ours = completions.activityFlows.filter(
      (f: { submitId: string }) => f.submitId === submitId,
    );
    expect(ours.length).toBeGreaterThan(0);
  });

  test('CR1.4: progress appears after logging out and back in on the same device', {
    tag: '@CR1.4',
  }, async ({ afApplet, afApi, afUser, cards, page, loginPage }) => {
    await seedFlowProgress(afApi, afApplet, 2);

    // App-level logout, then a fresh login in the same browser context.
    await page.goto('/protected/applets');
    await page.getByRole('button', { name: /AF Worker/ }).click();
    await page.getByText(/log ?out/i).click();
    await expect(page).toHaveURL(/login/, { timeout: 10000 });

    await loginPage.login(afUser.email, afUser.password);
    await expect(page).toHaveURL(/protected/, { timeout: 15000 });

    await page.getByText(afApplet.displayName).click();
    await expectFlowResumeAt(cards, 2);
  });

  test('CR1.5: progress appears when logging in on a different device', {
    tag: '@CR1.5',
  }, async ({ afApplet, afApi, afUser, browser }) => {
    await seedFlowProgress(afApi, afApplet, 2);

    const device2 = await openWebDevice(browser, afUser);
    try {
      const cards2 = new ActivityCardPage(device2.page);
      await openApplet(device2.page, afApplet);
      await expectFlowResumeAt(cards2, 2);
    } finally {
      await device2.context.close();
    }
  });

  // Uses a separate invited respondent, not self-assignment (self-assignment hits an unrelated app bug).
  test('CR1.6: progress appears for a manually assigned flow', {
    tag: '@CR1.6',
  }, async ({ afApplet, afApi, browser }) => {
    const respondent = await setupAssignedRespondent(afApi, afApplet, {
      activityFlowId: afApplet.manualFlowId,
    });

    const flowEvent = await getFlowEvent(afApi, afApplet, afApplet.manualFlowId);
    await respondent.answers.seedFlowProgress(afApplet, 2, {
      submitId: crypto.randomUUID(),
      flowId: afApplet.manualFlowId,
      eventId: flowEvent.id,
      eventVersion: flowEvent.version,
      targetSubjectId: respondent.subjectId,
    });

    const device = await openWebDevice(browser, respondent.user);
    try {
      const respondentCards = new ActivityCardPage(device.page);
      await openApplet(device.page, afApplet);
      await expectFlowResumeAt(respondentCards, 2, AF_MANUAL_FLOW_NAME);
    } finally {
      await device.context.close();
    }
  });
});
