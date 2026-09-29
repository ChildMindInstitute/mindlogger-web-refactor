import crypto from 'node:crypto';

import { Page, expect, test } from '@playwright/test';

import { AfApi, AfApplet } from '../../fixtures/af-applet.fixture';
import {
  AfUser,
  afAccountEmail,
  afApiContext,
  getOrCreateUser,
} from '../../fixtures/af-session.fixture';
import { ActivityCardPage } from '../../pages/activity-card.page';
import { SurveyPage } from '../../pages/survey.page';
import { AnswerAPI } from '../../utils/api-client/answer-api';
import { AssignmentAPI } from '../../utils/api-client/assignment-api';
import { InvitationAPI } from '../../utils/api-client/invitation-api';
import { AF_FLOW_NAME } from '../../utils/data/af-resume-applet';
import { getPrivateKey } from '../../utils/encryption';
import { getEntityProgress } from '../../utils/local-progress';
import { performUiLogin } from '../../utils/ui';
import { runtimeConfig } from '../../config';

export { AF_FLOW_NAME, AF_MANUAL_FLOW_NAME } from '../../utils/data/af-resume-applet';

export const FLOW_TOTAL_ACTIVITIES = 3;

export const getFlowEvent = async (afApi: AfApi, afApplet: AfApplet, flowId?: string) => {
  const events = await afApi.events.getEvents(afApplet.appletId);
  const flowEvent = events.result.find(
    (e: { flowId: string | null }) => e.flowId === (flowId ?? afApplet.flowId),
  );
  expect(flowEvent, 'event for the flow should exist').toBeTruthy();

  return flowEvent as { id: string; version: string };
};

// Seeds partial flow progress directly on the server (N of 3 activities done).
export const seedFlowProgress = async (
  afApi: AfApi,
  afApplet: AfApplet,
  completedActivities: number,
  options: { flowId?: string; endTime?: number; targetSubjectId?: string } = {},
) => {
  const flowEvent = await getFlowEvent(afApi, afApplet, options.flowId);
  const submitId = crypto.randomUUID();
  await afApi.answers.seedFlowProgress(afApplet, completedActivities, {
    submitId,
    flowId: options.flowId,
    eventId: flowEvent.id,
    eventVersion: flowEvent.version,
    endTime: options.endTime,
    targetSubjectId: options.targetSubjectId,
  });

  return { submitId, flowEvent };
};

export type AssignedRespondent = {
  user: AfUser;
  subjectId: string;
  // Clients authenticated as the respondent.
  answers: AnswerAPI;
};

// Invites the slot's respondent account and has it accept (no assignment).
export const addRespondent = async (
  ownerApi: AfApi,
  afApplet: AfApplet,
): Promise<AssignedRespondent> => {
  const slot = test.info().parallelIndex;
  const user = await getOrCreateUser(afAccountEmail('resp-w', slot), `Respondent${slot}`);
  const key = await ownerApi.invitations.inviteRespondent(afApplet.appletId, {
    email: user.email,
    firstName: 'AF',
    lastName: 'Respondent',
  });

  const respondentContext = await afApiContext(user);
  await new InvitationAPI(respondentContext).acceptInvite(key);
  const subjectId = await new AssignmentAPI(respondentContext).getMySubjectId(afApplet.appletId);

  const answers = new AnswerAPI(respondentContext);
  answers.setRespondent(getPrivateKey({ userId: user.id, email: user.email, password: user.password }));

  return { user, subjectId, answers };
};

// Invites a separate user, has them accept, then assigns the flow to them.
export const setupAssignedRespondent = async (
  ownerApi: AfApi,
  afApplet: AfApplet,
  target: { activityFlowId?: string; activityId?: string },
): Promise<AssignedRespondent> => {
  const respondent = await addRespondent(ownerApi, afApplet);
  await ownerApi.assignments.createAssignments(afApplet.appletId, [
    { ...target, respondentSubjectId: respondent.subjectId, targetSubjectId: respondent.subjectId },
  ]);

  return respondent;
};

// Opens the applet details page from the home screen (client-side navigation).
export const openApplet = async (page: Page, afApplet: AfApplet) => {
  await page.goto('/protected/applets');
  await page.getByText(afApplet.displayName).click();
  await expect(page.getByRole('heading', { name: 'Available' })).toBeVisible({ timeout: 15000 });
};

// Asserts the flow card offers Resume at `completed` of 3 progress.
export const expectFlowResumeAt = async (
  cards: ActivityCardPage,
  completed: number,
  flowName: string = AF_FLOW_NAME,
) => {
  const card = cards.flowCard(flowName);
  await expect(cards.progressText(card, completed, FLOW_TOTAL_ACTIVITIES)).toBeVisible({
    timeout: 15000,
  });
  await expect(cards.resumeButton(card)).toBeVisible();
  await expect(cards.restartButton(card)).toBeVisible();
};

// Clicks Resume and verifies the survey opens on the expected flow activity.
export const resumeAndExpectActivity = async (
  page: Page,
  cards: ActivityCardPage,
  activityNumber: number,
  flowName: string = AF_FLOW_NAME,
) => {
  await cards.resumeButton(cards.flowCard(flowName)).click();
  await expect(page.getByText(`Activity ${activityNumber} • 1 Question`)).toBeVisible({
    timeout: 15000,
  });
};

// Starts the flow from its card in the UI and waits for the survey to open.
export const startFlowInUi = async (
  page: Page,
  cards: ActivityCardPage,
  survey: SurveyPage,
  flowName: string = AF_FLOW_NAME,
) => {
  const startButton = cards.startButton(cards.flowCard(flowName));
  // Retry the click: React may not have attached handlers on first paint.
  await expect(async () => {
    await startButton.click();
    await expect(survey.saveAndExitButton).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 15000 });
};

// Completes `count` flow activities in the UI, starting from activity `from`.
export const completeFlowActivitiesInUi = async (
  page: Page,
  survey: SurveyPage,
  count: number,
  from = 1,
) => {
  for (let i = from; i < from + count; i++) {
    await survey.completeCurrentActivity();
    await expect(page.getByText(`Activity ${i + 1} • 1 Question`)).toBeVisible({ timeout: 15000 });
  }
};

// Returns this browser's saved progress for the flow.
export const getLocalFlowProgress = async (page: Page, afApplet: AfApplet, eventId: string) => {
  const progress = await getEntityProgress(page, afApplet.flowId, eventId);
  expect(progress, 'flow progress should be saved locally').toBeTruthy();

  return progress as { submitId: string; pipelineActivityOrder: number; endAt: number | null };
};

// Posts answers for flow activities [from, to) under an existing submitId.
// With `complete`, the last one marks the flow as completed.
export const submitFlowSteps = async (
  afApi: AfApi,
  afApplet: AfApplet,
  flowEvent: { id: string; version: string },
  options: { submitId: string; from: number; to: number; complete?: boolean; endTime?: number },
) => {
  const endTime = options.endTime ?? Date.now();
  for (let i = options.from; i < options.to; i++) {
    await afApi.answers.submitActivityAnswer(afApplet, afApplet.flowActivityIds[i], {
      submitId: options.submitId,
      flowId: afApplet.flowId,
      eventId: flowEvent.id,
      eventVersion: flowEvent.version,
      isFlowCompleted: !!options.complete && i === options.to - 1,
      endTime: endTime - (options.to - 1 - i) * 1000,
    });
  }
};

// Returns the server's chosen submission for the flow (the one the web syncs with).
export const getServerFlowEntry = async (afApi: AfApi, afApplet: AfApplet) => {
  const fromDate = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10);
  const completions = (
    await afApi.answers.getCompletedEntities(afApplet.appletId, afApplet.version, fromDate)
  ).result;

  return completions.activityFlows.find((f: { id: string }) => f.id === afApplet.flowId) as
    | { submitId: string; activityFlowOrder: number | null; isFlowCompleted: boolean | null }
    | undefined;
};

// Replaces the flow's default Always Available event with `count` all-day daily events.
export const scheduleFlowDaily = async (afApi: AfApi, afApplet: AfApplet, count = 1) => {
  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    const created = await afApi.events.createScheduledEvent(
      afApplet.appletId,
      { flowId: afApplet.flowId },
      { type: 'DAILY' },
    );
    ids.push(created.result.id);
  }
  const events = (await afApi.events.getEvents(afApplet.appletId)).result;

  return ids.map((id) => events.find((e: { id: string }) => e.id === id)) as {
    id: string;
    version: string;
  }[];
};

// Restarts the flow from its card, confirming the dialog, and waits for the survey.
export const restartFlowInUi = async (
  page: Page,
  cards: ActivityCardPage,
  survey: SurveyPage,
  flowName: string = AF_FLOW_NAME,
) => {
  await cards.restartButton(cards.flowCard(flowName)).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Restart' }).click();
  await expect(survey.saveAndExitButton).toBeVisible({ timeout: 15000 });
};

// Logs out through the header menu. Logout ends that login's session, so only
// call it in a browser from openWebDevice, never on the worker's shared `page`.
export const logoutInUi = async (page: Page) => {
  await page.goto('/protected/applets');
  await page.getByRole('button', { name: /^AF / }).click();
  await page.getByText(/log ?out/i).click();
  await expect(page).toHaveURL(/login/, { timeout: 10000 });
};

// Leaves the survey with Save & Exit and waits for the applet page.
export const saveAndExitInUi = async (page: Page, survey: SurveyPage) => {
  // Retry the click: React may not have attached handlers on first paint.
  await expect(async () => {
    await survey.saveAndExitButton.click();
    await expect(page.getByRole('heading', { name: 'Available' })).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 15000 });
};

// Logs a user in through the login form.
export const loginInUi = async (page: Page, user: AfUser) => {
  await performUiLogin(page, `${runtimeConfig.baseURL}/login`, user.email, user.password);
  await expect(page).toHaveURL(/protected/, { timeout: 15000 });
};
