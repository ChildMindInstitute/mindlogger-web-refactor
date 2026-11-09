import crypto from 'node:crypto';

import { Page, expect } from '@playwright/test';

import { test } from '../../../fixtures/af.fixtures';
import { ActivityCardPage } from '../../../pages/activity-card.page';
import { SurveyPage } from '../../../pages/survey.page';
import { AF_STANDALONE_ACTIVITY_NAMES } from '../../../utils/data/af-resume-applet';
import { openApplet, saveAndExitInUi } from '../support';

const ACTIVITY_NAME = AF_STANDALONE_ACTIVITY_NAMES[0];
const ALREADY_COMPLETED_BANNER = 'This survey was already completed on a different device.';

// Answers the activity's one question and leaves without submitting it.
const leaveActivityInProgress = async (page: Page, cards: ActivityCardPage, survey: SurveyPage) => {
  const card = cards.activityCard(ACTIVITY_NAME);
  // Retry the click: React may not have attached handlers on first paint.
  await expect(async () => {
    await cards.startButton(card).click();
    await expect(survey.saveAndExitButton).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 15000 });
  await survey.startButton.click();
  await survey.firstOption.click();
  await saveAndExitInUi(page, survey);
  await expect(cards.resumeButton(card)).toBeVisible({ timeout: 15000 });
};

test.describe('Standalone activities', () => {
  test('X52: in-progress activity resumes after refreshing the home page', {
    tag: '@X52',
  }, async ({ afApplet, cards, survey, page }) => {
    await openApplet(page, afApplet);
    await leaveActivityInProgress(page, cards, survey);

    await page.goto('/protected/applets');
    await page.reload();
    await page.getByText(afApplet.displayName).click();

    await cards.resumeButton(cards.activityCard(ACTIVITY_NAME)).click();
    await expect(page.getByText(`${ACTIVITY_NAME} question`)).toBeVisible({ timeout: 15000 });
  });

  test('X65: in-progress activity completed on another device (AA) cannot be resumed', {
    tag: '@X65',
  }, async ({ afApplet, afApi, cards, survey, page }) => {
    const activityId = afApplet.standaloneActivityIds[0];
    const events = (await afApi.events.getEvents(afApplet.appletId)).result;
    const event = events.find((e: { activityId: string | null }) => e.activityId === activityId);

    await openApplet(page, afApplet);
    await leaveActivityInProgress(page, cards, survey);

    // Another device completes the activity.
    await afApi.answers.submitActivityAnswer(afApplet, activityId, {
      submitId: crypto.randomUUID(),
      eventId: event.id,
      eventVersion: event.version,
    });

    // No refresh: Resume bounces back with the banner; only a new Start is possible.
    const card = cards.activityCard(ACTIVITY_NAME);
    await cards.resumeButton(card).click();
    await expect(page.getByText(ALREADY_COMPLETED_BANNER)).toBeVisible({ timeout: 15000 });
    await expect(cards.startButton(card)).toBeVisible({ timeout: 15000 });
    await expect(cards.resumeButton(card)).toHaveCount(0);
  });
});
