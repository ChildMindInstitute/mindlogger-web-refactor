import { expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';
import {
  completeFlowActivitiesInUi,
  expectFlowResumeAt,
  getFlowEvent,
  getLocalFlowProgress,
  getServerFlowEntry,
  openApplet,
  resumeAndExpectActivity,
  startFlowInUi,
} from '../support';

// CR4: this browser has more completed steps than the server. The local progress must win.
test.describe('CR4: local ahead of server', () => {
  test('CR4.4: refreshing the applet page keeps the local step', {
    tag: '@CR4.4',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);

    // Fake a success for the 2nd answer upload so the server stays one step behind.
    let answerPosts = 0;
    await page.route('**/answers', async (route) => {
      if (route.request().method() !== 'POST') return route.continue();
      answerPosts += 1;
      if (answerPosts === 2) {
        return route.fulfill({ status: 201, contentType: 'application/json', body: '{"result":{}}' });
      }
      return route.continue();
    });

    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 2);
    await page.unroute('**/answers');

    const { submitId } = await getLocalFlowProgress(page, afApplet, flowEvent.id);
    const serverEntry = await getServerFlowEntry(afApi, afApplet);
    expect(serverEntry?.submitId).toBe(submitId);
    expect(serverEntry?.activityFlowOrder).toBe(1);

    await openApplet(page, afApplet);
    await page.reload();
    await expectFlowResumeAt(cards, 2);
    await resumeAndExpectActivity(page, cards, 3);
  });
});
