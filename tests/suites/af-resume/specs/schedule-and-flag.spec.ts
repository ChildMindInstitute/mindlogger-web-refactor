import crypto from 'node:crypto';

import { expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';
import { openWebDevice } from '../../../fixtures/af-session.fixture';
import { ActivityCardPage } from '../../../pages/activity-card.page';
import { AF_RESUME_ALL_APPLETS } from '../../../utils/feature-flags';
import {
  AF_FLOW_NAME,
  completeFlowActivitiesInUi,
  expectFlowResumeAt,
  getFlowEvent,
  getServerFlowEntry,
  openApplet,
  resumeAndExpectActivity,
  scheduleFlowDaily,
  seedFlowProgress,
  startFlowInUi,
} from '../support';

const pad = (n: number) => String(n).padStart(2, '0');

test.describe('Schedule and flag changes', () => {
  test('X42: flag enabled for one applet only turns resume on for that applet only', {
    tag: '@X42',
  }, async ({ afApplet, afApi, afUser, browser }) => {
    await seedFlowProgress(afApi, afApplet, 2);

    // Flag scoped to some other applet: this applet has no Resume.
    const off = await openWebDevice(browser, afUser, {
      flags: { ...AF_RESUME_ALL_APPLETS, enableFlowResume: [crypto.randomUUID()] },
    });
    try {
      const offCards = new ActivityCardPage(off.page);
      const synced = off.page.waitForResponse((r) => r.url().includes('/completions'));
      await openApplet(off.page, afApplet);
      // Resume off for this applet: in-progress runs are not even requested.
      expect(new URL((await synced).url()).searchParams.get('includeInProgress')).toBeNull();
      await expect(offCards.startButton(offCards.flowCard(AF_FLOW_NAME))).toBeVisible({ timeout: 15000 });
      await expect(offCards.resumeButton(offCards.flowCard(AF_FLOW_NAME))).toHaveCount(0);
    } finally {
      await off.context.close();
    }

    // Flag scoped to this applet: Resume is offered.
    const on = await openWebDevice(browser, afUser, {
      flags: { ...AF_RESUME_ALL_APPLETS, enableFlowResume: [afApplet.appletId] },
    });
    try {
      await openApplet(on.page, afApplet);
      await expectFlowResumeAt(new ActivityCardPage(on.page), 2);
    } finally {
      await on.context.close();
    }
  });

  test('X44: resume still works after the schedule event is changed mid-flow', {
    tag: '@X44',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const [event] = await scheduleFlowDaily(afApi, afApplet);

    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);

    // Owner edits the event (new end time, still open now).
    await afApi.events.updateScheduledEvent(afApplet.appletId, event.id, { endTime: '23:58:00' });

    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 1);
    await resumeAndExpectActivity(page, cards, 2);
  });

  test('R2.7: idle timer expiring (AA) ends the run; the flow can only be started again', {
    tag: '@R2.7',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);
    await afApi.events.updateEvent(afApplet.appletId, flowEvent.id, {
      periodicity: { type: 'ALWAYS' },
      oneTimeCompletion: false,
      startTime: '00:00:00',
      endTime: '23:59:00',
      timerType: 'IDLE',
      timer: '00:01:00',
    });

    // Fake clock so the 1-minute idle timer can be skipped.
    await page.clock.install();
    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);

    // On activity 2's question, interact once (starts the idle timer), then go idle.
    await survey.startButton.click();
    await page.mouse.move(10, 10);
    await page.clock.fastForward('02:00');

    const timesUp = page.getByRole('dialog').filter({ hasText: "Time's Up" });
    await expect(timesUp).toBeVisible({ timeout: 15000 });
    await timesUp.getByRole('button').click();

    // The run is auto-completed, so there is nothing to resume.
    await expect
      .poll(async () => (await getServerFlowEntry(afApi, afApplet))?.isFlowCompleted, { timeout: 30000 })
      .toBe(true);
    await openApplet(page, afApplet);
    const card = cards.flowCard(AF_FLOW_NAME);
    await expect(cards.startButton(card)).toBeVisible({ timeout: 15000 });
    await expect(cards.resumeButton(card)).toHaveCount(0);
  });
});

// Schedule times are read in the browser's time zone; pin it to UTC to match the test's clock.
test.describe('Schedule window', () => {
  test.use({ timezoneId: 'UTC' });

  test('R1.9: Resume stays enabled after the schedule window ends mid-flow', {
    tag: '@R1.9',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const now = new Date();
    test.skip(now.getUTCHours() === 0 && now.getUTCMinutes() < 10, 'window must be able to end before now');

    const [event] = await scheduleFlowDaily(afApi, afApplet);

    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);

    // Owner shrinks today's window so it ended a few minutes ago.
    const ended = new Date(now.getTime() - 5 * 60 * 1000);
    await afApi.events.updateScheduledEvent(afApplet.appletId, event.id, {
      endTime: `${pad(ended.getUTCHours())}:${pad(ended.getUTCMinutes())}:00`,
    });

    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 1);
    await resumeAndExpectActivity(page, cards, 2);
  });
});
