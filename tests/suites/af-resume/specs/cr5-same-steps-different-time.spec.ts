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
  seedFlowProgress,
  startFlowInUi,
} from '../support';

// CR5: local and server are on the same step in different runs. The most recent run must win.
test.describe('CR5: same steps, different timestamps', () => {
  test('CR5.2: Web1 > Web2 > Web1 without refresh resumes the Web2 run', {
    tag: '@CR5.2',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);

    // Web1: activity 1 done.
    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);

    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 1);

    // Web2 (seeded): a newer run, also at activity 1 done.
    const { submitId: web2SubmitId } = await seedFlowProgress(afApi, afApplet, 1);

    // Web1, no refresh: Resume switches to the Web2 run.
    await resumeAndExpectActivity(page, cards, 2);
    await expect
      .poll(async () => (await getLocalFlowProgress(page, afApplet, flowEvent.id)).submitId)
      .toBe(web2SubmitId);

    // Finishing activity 2 lands in the Web2 submission on the server.
    await completeFlowActivitiesInUi(page, survey, 1, 2);
    await expect
      .poll(async () => await getServerFlowEntry(afApi, afApplet))
      .toMatchObject({ submitId: web2SubmitId, activityFlowOrder: 2 });
  });
});
