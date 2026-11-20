import { expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';
import {
  completeFlowActivitiesInUi,
  expectFlowResumeAt,
  openApplet,
  removeFlowActivity,
  restartFlowInUi,
  saveAndExitInUi,
  startFlowInUi,
} from '../support';

test.describe('Version change', () => {
  test('VC2.1: activity removed mid-flow; Resume continues the old version, Restart uses the new one', {
    tag: '@VC2.1',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    // Run started on the 3-activity version, activity 1 done.
    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);

    // Owner removes activity 2 from the flow (new applet version).
    await removeFlowActivity(afApi, afApplet, 1);

    // Resume: still the old version, so activity 2 is next.
    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 1);
    await cards.resumeButton(cards.flowCard('AF Resume Flow')).click();
    await expect(page.getByRole('heading', { name: 'AF Activity 2' })).toBeVisible({ timeout: 15000 });
    await saveAndExitInUi(page, survey);

    // Restart: the new version, so activity 3 follows activity 1.
    await restartFlowInUi(page, cards, survey);
    await expect(page.getByRole('heading', { name: 'AF Activity 1' })).toBeVisible({ timeout: 15000 });
    await survey.completeCurrentActivity();
    await expect(page.getByRole('heading', { name: 'AF Activity 3' })).toBeVisible({ timeout: 15000 });
  });
});
