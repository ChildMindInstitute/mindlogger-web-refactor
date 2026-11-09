import { expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';
import {
  AF_FLOW_NAME,
  completeFlowActivitiesInUi,
  expectFlowResumeAt,
  getFlowEvent,
  getLocalFlowProgress,
  openApplet,
  resumeAndExpectActivity,
  seedFlowProgress,
  startFlowInUi,
  submitFlowSteps,
} from '../support';

const ALREADY_COMPLETED_BANNER = 'This survey was already completed on a different device.';

// CR6: this browser can still resume, but another device already completed that run.
test.describe('CR6: server says not resumable', () => {
  test('CR6.1: run completed on device 2 (AA) blocks Resume but allows a new Start', {
    tag: '@CR6.1',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);

    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);
    const { submitId } = await getLocalFlowProgress(page, afApplet, flowEvent.id);

    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 1);

    // Device 2 finishes the same run.
    await submitFlowSteps(afApi, afApplet, flowEvent, { submitId, from: 1, to: 3, complete: true });

    // No refresh: Resume bounces back with the "already completed" banner.
    const card = cards.flowCard(AF_FLOW_NAME);
    await cards.resumeButton(card).click();
    await expect(page.getByText(ALREADY_COMPLETED_BANNER)).toBeVisible({ timeout: 15000 });
    await expect(cards.startButton(card)).toBeVisible({ timeout: 15000 });
    await expect(cards.resumeButton(card)).toHaveCount(0);
  });

  test('CR6.3: run completed on device 2 (OneTime) blocks Resume and hides the flow', {
    tag: '@CR6.3',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const defaultEvent = await getFlowEvent(afApi, afApplet);
    await afApi.events.updateEvent(afApplet.appletId, defaultEvent.id, {
      periodicity: { type: 'ALWAYS' },
      oneTimeCompletion: true,
      timerType: 'NOT_SET',
      startTime: '00:00:00',
      endTime: '23:59:00',
    });
    const flowEvent = await getFlowEvent(afApi, afApplet);

    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);
    const { submitId } = await getLocalFlowProgress(page, afApplet, flowEvent.id);

    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 1);

    await submitFlowSteps(afApi, afApplet, flowEvent, { submitId, from: 1, to: 3, complete: true });

    await cards.resumeButton(cards.flowCard(AF_FLOW_NAME)).click();
    await expect(page.getByText(ALREADY_COMPLETED_BANNER)).toBeVisible({ timeout: 15000 });
    await expect(cards.flowCard(AF_FLOW_NAME)).toHaveCount(0, { timeout: 15000 });
  });

  test('CR6.2.4: local run at 2/3 was completed on device 2, which started a new run; Resume opens the new run', {
    tag: '@CR6.2.4',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);

    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 2);
    const { submitId } = await getLocalFlowProgress(page, afApplet, flowEvent.id);

    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 2);

    // Device 2 finishes run 1, then starts run 2 and completes its activity 1.
    const run1EndTime = Date.now();
    await submitFlowSteps(afApi, afApplet, flowEvent, {
      submitId,
      from: 2,
      to: 3,
      complete: true,
      endTime: run1EndTime,
    });
    const { submitId: run2SubmitId } = await seedFlowProgress(afApi, afApplet, 1, {
      endTime: run1EndTime + 1000,
    });

    // No refresh: Resume redirects from activity 3 (run 1) to activity 2 (run 2).
    await resumeAndExpectActivity(page, cards, 2);
    await expect
      .poll(async () => (await getLocalFlowProgress(page, afApplet, flowEvent.id)).submitId)
      .toBe(run2SubmitId);
  });
});
