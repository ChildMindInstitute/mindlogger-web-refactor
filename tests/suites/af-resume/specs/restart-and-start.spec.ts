import crypto from 'node:crypto';

import { expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';
import {
  AF_FLOW_NAME,
  AF_MANUAL_FLOW_NAME,
  FLOW_TOTAL_ACTIVITIES,
  completeFlowActivitiesInUi,
  expectFlowResumeAt,
  getFlowEvent,
  getLocalFlowProgress,
  getServerFlowEntry,
  makeFlowOneTime,
  openApplet,
  restartFlowInUi,
  saveAndExitInUi,
  startFlowInUi,
  submitFlowSteps,
} from '../support';

const ALREADY_COMPLETED_BANNER = 'This survey was already completed on a different device.';

test.describe('Restart and start rules', () => {
  test('X24: restarting an in-progress flow (AA) starts a new run at activity 1', {
    tag: '@X24',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);

    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);
    const { submitId: runA } = await getLocalFlowProgress(page, afApplet, flowEvent.id);

    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 1);
    await restartFlowInUi(page, cards, survey);
    await expect(page.getByText('Activity 1 • 1 Question')).toBeVisible({ timeout: 15000 });
    await completeFlowActivitiesInUi(page, survey, 1);

    const { submitId: runB } = await getLocalFlowProgress(page, afApplet, flowEvent.id);
    expect(runB).not.toBe(runA);

    // Both runs are at 1/3; the newer one (B) is what the card resumes.
    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 1);
    await expect.poll(async () => (await getServerFlowEntry(afApi, afApplet))?.submitId).toBe(runB);
    expect((await getLocalFlowProgress(page, afApplet, flowEvent.id)).submitId).toBe(runB);
  });

  test('X29: restart is allowed after another device completed the run (AA); answers go to a new run', {
    tag: '@X29',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await getFlowEvent(afApi, afApplet);

    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);
    const { submitId: runA } = await getLocalFlowProgress(page, afApplet, flowEvent.id);

    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 1);

    // Another device finishes run A.
    await submitFlowSteps(afApi, afApplet, flowEvent, { submitId: runA, from: 1, to: 3, complete: true });

    // No refresh: Restart still works and the new answers form a separate run.
    await restartFlowInUi(page, cards, survey);
    await expect(page.getByText('Activity 1 • 1 Question')).toBeVisible({ timeout: 15000 });
    await completeFlowActivitiesInUi(page, survey, 1);

    await expect
      .poll(async () => await getServerFlowEntry(afApi, afApplet))
      .toMatchObject({ isFlowCompleted: false, activityFlowOrder: 1 });
    expect((await getServerFlowEntry(afApi, afApplet))?.submitId).not.toBe(runA);
  });

  test('X30: restart is blocked after another device completed the run (OneTime)', {
    tag: '@X30',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await makeFlowOneTime(afApi, afApplet);

    await openApplet(page, afApplet);
    await startFlowInUi(page, cards, survey);
    await completeFlowActivitiesInUi(page, survey, 1);
    const { submitId: runA } = await getLocalFlowProgress(page, afApplet, flowEvent.id);

    await openApplet(page, afApplet);
    await expectFlowResumeAt(cards, 1);

    await submitFlowSteps(afApi, afApplet, flowEvent, { submitId: runA, from: 1, to: 3, complete: true });

    // No refresh: Restart bounces back with the banner and the flow disappears.
    await cards.restartButton(cards.flowCard(AF_FLOW_NAME)).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Restart' }).click();
    await expect(page.getByText(ALREADY_COMPLETED_BANNER)).toBeVisible({ timeout: 15000 });
    await expect(cards.flowCard(AF_FLOW_NAME)).toHaveCount(0, { timeout: 15000 });
  });

  test('X35: manual OneTime flow completed about User1 elsewhere can still be restarted about User2', {
    tag: '@X35',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const flowEvent = await makeFlowOneTime(afApi, afApplet, afApplet.manualFlowId);

    // The worker user answers the manual flow about two limited accounts.
    const ownerSubjectId = await afApi.assignments.getMySubjectId(afApplet.appletId);
    const user1 = await afApi.assignments.createLimitedSubject(afApplet.appletId, 'User1', 'Limited');
    const user2 = await afApi.assignments.createLimitedSubject(afApplet.appletId, 'User2', 'Limited');
    await afApi.assignments.createAssignments(
      afApplet.appletId,
      [user1, user2].map((targetSubjectId) => ({
        activityFlowId: afApplet.manualFlowId,
        respondentSubjectId: ownerSubjectId,
        targetSubjectId,
      })),
    );

    // Web: about User2, activity 1 done.
    await openApplet(page, afApplet);
    const user2Card = cards.flowCard(AF_MANUAL_FLOW_NAME).filter({ hasText: 'About User2 L.' });
    await expect(async () => {
      await cards.startButton(user2Card).click();
      await expect(survey.saveAndExitButton).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 15000 });
    await completeFlowActivitiesInUi(page, survey, 1);

    // Another device completes the flow about User1.
    await afApi.answers.completeFlow(afApplet, {
      submitId: crypto.randomUUID(),
      flowId: afApplet.manualFlowId,
      eventId: flowEvent.id,
      eventVersion: flowEvent.version,
      targetSubjectId: user1,
    });

    // Leave via Save & Exit, not a page load: reloading a survey screen about someone
    // blanks the app (the subject banner's icon is persisted and breaks on restore).
    await saveAndExitInUi(page, survey);
    await expect(cards.flowCard(AF_MANUAL_FLOW_NAME).filter({ hasText: 'About User1 L.' })).toHaveCount(0, {
      timeout: 15000,
    });
    await expect(cards.progressText(user2Card, 1, FLOW_TOTAL_ACTIVITIES)).toBeVisible();

    // Restart about User2 is still allowed.
    await cards.restartButton(user2Card).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Restart' }).click();
    await expect(page.getByText('Activity 1 • 1 Question')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(ALREADY_COMPLETED_BANNER)).toHaveCount(0);
  });
});
