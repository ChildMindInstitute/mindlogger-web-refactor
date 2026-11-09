import { test } from '../../../fixtures/af.fixtures';
import {
  completeFlowActivitiesInUi,
  expectFlowResumeAt,
  getFlowEvent,
  getLocalFlowProgress,
  openApplet,
  resumeAndExpectActivity,
  startFlowInUi,
  submitFlowSteps,
} from '../support';

// CR3: this browser has fewer completed steps than the server. The server progress must win.
test.describe('CR3: local behind server', () => {
  test('CR3.5: refreshing the applet page resumes from the server step', {
    tag: '@CR3.5',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);

    // Local: activity 1 done in this browser.
    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);
    const { submitId } = await getLocalFlowProgress(page, afApplet, flowEvent.id);

    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 1);

    // Another device answers activity 2 in the same submission.
    await submitFlowSteps(afApi, afApplet, flowEvent, { submitId, from: 1, to: 2 });

    await page.reload();
    await expectFlowResumeAt(cards, 2);
    await resumeAndExpectActivity(page, cards, 3);
  });
});
