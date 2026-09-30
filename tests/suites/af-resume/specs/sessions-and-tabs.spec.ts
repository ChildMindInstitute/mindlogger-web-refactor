import { expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';
import { openWebDevice } from '../../../fixtures/af-session.fixture';
import { ActivityCardPage } from '../../../pages/activity-card.page';
import { SurveyPage } from '../../../pages/survey.page';
import {
  AF_FLOW_NAME,
  addRespondent,
  completeFlowActivitiesInUi,
  expectFlowResumeAt,
  getFlowEvent,
  getLocalFlowProgress,
  getServerFlowEntry,
  loginInUi,
  logoutInUi,
  openApplet,
  restartFlowInUi,
  saveAndExitInUi,
  resumeAndExpectActivity,
  startFlowInUi,
} from '../support';

// Sheet cases use a 4-activity flow; steps are scaled to the suite's 3-activity flow.
test.describe('Sessions and multiple tabs', () => {
  test('X1: Web1 start > Web2 continue > Web1 restart > Web2 resumes the farthest run and completes it', {
    tag: '@X1',
  }, async ({ afApplet, afApi, afUser, browser, cards, survey, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);

    // Web1: run A, activity 1 done.
    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);

    const web2 = await openWebDevice(browser, afUser);
    try {
      const web2Cards = new ActivityCardPage(web2.page);
      const web2Survey = new SurveyPage(web2.page);

      // Web2: continues run A to 2/3.
      await openApplet(web2.page, afApplet);
      await expectFlowResumeAt(web2Cards, 1);
      await resumeAndExpectActivity(web2.page, web2Cards, 2);
      await completeFlowActivitiesInUi(web2.page, web2Survey, 1, 2);

      // Web1: restarts (run B) and reaches 2/3, later than run A.
      await openApplet(page, afApplet);
      await expectFlowResumeAt(cards, 2);
      await restartFlowInUi(page, cards, survey);
      await completeFlowActivitiesInUi(page, survey, 2);
      const { submitId: runB } = await getLocalFlowProgress(page, afApplet, flowEvent.id);

      // Web2: resumes run B and completes it.
      await openApplet(web2.page, afApplet);
      await expectFlowResumeAt(web2Cards, 2);
      await resumeAndExpectActivity(web2.page, web2Cards, 3);
      await expect
        .poll(async () => (await getLocalFlowProgress(web2.page, afApplet, flowEvent.id)).submitId)
        .toBe(runB);
      await web2Survey.completeCurrentActivity();

      await expect
        .poll(async () => await getServerFlowEntry(afApi, afApplet))
        .toMatchObject({ submitId: runB, isFlowCompleted: true });
    } finally {
      await web2.context.close();
    }
  });

  test('X2: restart then Save & Exit before answering resumes the farthest run', {
    tag: '@X2',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);

    // Run A: activity 1 done.
    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);
    const { submitId: runA } = await getLocalFlowProgress(page, afApplet, flowEvent.id);

    // Restart (run B) and leave straight away with nothing answered.
    await openApplet(page, afApplet);
    await restartFlowInUi(page, cards, survey);
    await saveAndExitInUi(page, survey);

    // Run A is farther, so it is the one offered.
    await expectFlowResumeAt(cards, 1);
    await resumeAndExpectActivity(page, cards, 2);
    await expect
      .poll(async () => (await getLocalFlowProgress(page, afApplet, flowEvent.id)).submitId)
      .toBe(runA);
  });

  test('X10: User1 progress survives User2 working on the same flow in the same browser', {
    tag: '@X10',
  }, async ({ afApplet, afApi, afUser, browser }) => {
    const user2 = await addRespondent(afApi, afApplet);

    // Own browser: logging out here must not end the worker's shared session.
    const web = await openWebDevice(browser, afUser);
    try {
      const { page } = web;
      const cards = new ActivityCardPage(page);
      const survey = new SurveyPage(page);

      // User1: activity 1 done.
      await openApplet(page, afApplet);
      await startFlowInUi(page, cards, survey);
      await completeFlowActivitiesInUi(page, survey, 1);
      await logoutInUi(page);

      // User2: sees a fresh flow, then gets to 2/3.
      await loginInUi(page, user2.user);
      await openApplet(page, afApplet);
      await expect(cards.resumeButton(cards.flowCard(AF_FLOW_NAME))).toHaveCount(0);
      await startFlowInUi(page, cards, survey);
      await completeFlowActivitiesInUi(page, survey, 2);
      await logoutInUi(page);

      // User1: back at their own 1/3.
      await loginInUi(page, afUser);
      await openApplet(page, afApplet);
      await expectFlowResumeAt(cards, 1);
      await resumeAndExpectActivity(page, cards, 2);
    } finally {
      await web.context.close();
    }
  });

  test('X12: clearing the browser cache and hard reloading keeps the progress', {
    tag: '@X12',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);

    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);
    const { submitId } = await getLocalFlowProgress(page, afApplet, flowEvent.id);

    await openApplet(page, afApplet);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Network.clearBrowserCache');
    await page.reload();

    await expectFlowResumeAt(cards, 1);
    await resumeAndExpectActivity(page, cards, 2);
    expect((await getLocalFlowProgress(page, afApplet, flowEvent.id)).submitId).toBe(submitId);
  });

  test('X20: progress with no completed activity is lost after logout', {
    tag: '@X20',
  }, async ({ afApplet, afUser, browser }) => {
    const web = await openWebDevice(browser, afUser);
    try {
      const { page } = web;
      const cards = new ActivityCardPage(page);
      const survey = new SurveyPage(page);

      // Answer activity 1's question but leave before submitting it.
      await openApplet(page, afApplet);
      await startFlowInUi(page, cards, survey);
      await survey.startButton.click();
      await survey.firstOption.click();
      await saveAndExitInUi(page, survey);
      await expect(cards.resumeButton(cards.flowCard(AF_FLOW_NAME))).toBeVisible({ timeout: 15000 });

      await logoutInUi(page);
      await loginInUi(page, afUser);

      const synced = page.waitForResponse((r) => r.url().includes('/completions'));
      await openApplet(page, afApplet);
      await synced;
      const card = cards.flowCard(AF_FLOW_NAME);
      await expect(cards.startButton(card)).toBeVisible({ timeout: 15000 });
      await expect(cards.resumeButton(card)).toHaveCount(0);
    } finally {
      await web.context.close();
    }
  });
});
