import crypto from 'node:crypto';

import { Page, expect } from '@playwright/test';

import { AfApi, AfApplet } from '../../fixtures/af-applet.fixture';
import { AfUser, afApiContext, createTestUser } from '../../fixtures/af-session.fixture';
import { ActivityCardPage } from '../../pages/activity-card.page';
import { AnswerAPI } from '../../utils/api-client/answer-api';
import { AssignmentAPI } from '../../utils/api-client/assignment-api';
import { InvitationAPI } from '../../utils/api-client/invitation-api';
import { AF_FLOW_NAME } from '../../utils/data/af-resume-applet';
import { getPrivateKey } from '../../utils/encryption';

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

// Invites a separate user, has them accept, then assigns the flow to them.
export const setupAssignedRespondent = async (
  ownerApi: AfApi,
  afApplet: AfApplet,
  target: { activityFlowId?: string; activityId?: string },
): Promise<AssignedRespondent> => {
  const user = await createTestUser('af-respondent');
  const key = await ownerApi.invitations.inviteRespondent(afApplet.appletId, {
    email: user.email,
    firstName: 'AF',
    lastName: 'Respondent',
  });

  const respondentContext = await afApiContext(user);
  await new InvitationAPI(respondentContext).acceptInvite(key);
  const subjectId = await new AssignmentAPI(respondentContext).getMySubjectId(afApplet.appletId);

  await ownerApi.assignments.createAssignments(afApplet.appletId, [
    { ...target, respondentSubjectId: subjectId, targetSubjectId: subjectId },
  ]);

  const answers = new AnswerAPI(respondentContext);
  answers.setRespondent(getPrivateKey({ userId: user.id, email: user.email, password: user.password }));

  return { user, subjectId, answers };
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
