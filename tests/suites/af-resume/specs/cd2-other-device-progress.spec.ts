import crypto from 'node:crypto';

import { expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';
import { openWebDevice } from '../../../fixtures/af-session.fixture';
import { ActivityCardPage } from '../../../pages/activity-card.page';
import { getEntityProgress } from '../../../utils/local-progress';
import {
  AF_FLOW_NAME,
  AF_MANUAL_FLOW_NAME,
  FLOW_TOTAL_ACTIVITIES,
  expectFlowResumeAt,
  getFlowEvent,
  openApplet,
  resumeAndExpectActivity,
  scheduleFlowDaily,
} from '../support';

// CD2: another device (e.g. mobile) stopped the flow at 2/3; web has no local progress.
test.describe('CD2: progress from another device, web empty', () => {
  test('CD2.4: two scheduled events; Resume is on the event that has progress', {
    tag: '@CD2.4',
  }, async ({ afApplet, afApi, cards, page }) => {
    const [event1, event2] = await scheduleFlowDaily(afApi, afApplet, 2);

    await afApi.answers.seedFlowProgress(afApplet, 2, {
      submitId: crypto.randomUUID(),
      eventId: event1.id,
      eventVersion: event1.version,
    });

    await openApplet(page, afApplet);
    const flowCards = cards.flowCard(AF_FLOW_NAME);
    await expect(flowCards).toHaveCount(2, { timeout: 15000 });

    // Only one of the two cards carries the progress.
    const resume = page.getByRole('button', { name: 'Resume', exact: true });
    const inProgress = flowCards.filter({ has: resume });
    await expect(inProgress).toHaveCount(1);
    await expect(cards.progressText(inProgress, 2, FLOW_TOTAL_ACTIVITIES)).toBeVisible();
    await expect(cards.startButton(flowCards.filter({ hasNot: resume }))).toBeVisible();

    await cards.resumeButton(inProgress).click();
    await expect(page.getByText('Activity 3 • 1 Question')).toBeVisible({ timeout: 15000 });

    // The resumed progress belongs to event 1, not event 2.
    expect(await getEntityProgress(page, afApplet.flowId, event1.id)).toBeTruthy();
    expect(await getEntityProgress(page, afApplet.flowId, event2.id)).toBeFalsy();
  });

  test('CD2.7: manual assign about a limited account resumes on that participant card', {
    tag: '@CD2.7',
  }, async ({ afApplet, afApi, cards, page }) => {
    const ownerSubjectId = await afApi.assignments.getMySubjectId(afApplet.appletId);
    const limitedSubjectId = await afApi.assignments.createLimitedSubject(
      afApplet.appletId,
      'Limited',
      'Subject',
    );
    await afApi.assignments.createAssignments(afApplet.appletId, [
      {
        activityFlowId: afApplet.manualFlowId,
        respondentSubjectId: ownerSubjectId,
        targetSubjectId: limitedSubjectId,
      },
    ]);

    const flowEvent = await getFlowEvent(afApi, afApplet, afApplet.manualFlowId);
    await afApi.answers.seedFlowProgress(afApplet, 2, {
      submitId: crypto.randomUUID(),
      flowId: afApplet.manualFlowId,
      eventId: flowEvent.id,
      eventVersion: flowEvent.version,
      targetSubjectId: limitedSubjectId,
    });

    await openApplet(page, afApplet);
    const card = cards.flowCard(AF_MANUAL_FLOW_NAME).filter({ hasText: 'About Limited S.' });
    await expect(cards.progressText(card, 2, FLOW_TOTAL_ACTIVITIES)).toBeVisible({ timeout: 15000 });
    await expect(cards.resumeButton(card)).toBeVisible();

    await cards.resumeButton(card).click();
    await expect(page.getByText('Activity 3 • 1 Question')).toBeVisible({ timeout: 15000 });
  });

  test('CD2.10: scheduled event, web in a different time zone resumes at the same step', {
    tag: '@CD2.10',
  }, async ({ afApplet, afApi, afUser, browser }) => {
    const [event] = await scheduleFlowDaily(afApi, afApplet);

    // Seeded in UTC (the test runner's zone); web runs 14 hours ahead.
    await afApi.answers.seedFlowProgress(afApplet, 2, {
      submitId: crypto.randomUUID(),
      eventId: event.id,
      eventVersion: event.version,
    });

    const web = await openWebDevice(browser, afUser, { timezoneId: 'Pacific/Kiritimati' });
    try {
      const webCards = new ActivityCardPage(web.page);
      await openApplet(web.page, afApplet);
      await expectFlowResumeAt(webCards, 2);
      await resumeAndExpectActivity(web.page, webCards, 3);
    } finally {
      await web.context.close();
    }
  });
});
