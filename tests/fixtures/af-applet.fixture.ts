import { AppletAPI } from '../utils/api-client/applet-api';
import { AnswerAPI } from '../utils/api-client/answer-api';
import { AssignmentAPI } from '../utils/api-client/assignment-api';
import { EventAPI } from '../utils/api-client/event-api';
import { InvitationAPI } from '../utils/api-client/invitation-api';
import {
  AF_FLOW_NAME,
  AF_MANUAL_FLOW_NAME,
  AF_STANDALONE_ACTIVITY_NAMES,
  buildAfResumeAppletPayload,
} from '../utils/data/af-resume-applet';
import { buildAppletEncryption, getPrivateKey } from '../utils/encryption';
import { afApiContext, test as sessionTest } from './af-session.fixture';

export type AfApplet = {
  appletId: string;
  displayName: string;
  version: string;
  flowId: string;
  // autoAssign=false twin of the flow; visible only after manual assignment.
  manualFlowId: string;
  // Activity ids in flow order.
  flowActivityIds: string[];
  standaloneActivityIds: string[];
  // Item ids keyed by activity id, needed for answer submissions.
  itemIdsByActivityId: Record<string, string[]>;
  // Owner key material, needed to encrypt seeded answers.
  ownerPrivateKey: number[];
  appletPublicKey: number[];
};

export type AfApi = {
  applets: AppletAPI;
  events: EventAPI;
  answers: AnswerAPI;
  assignments: AssignmentAPI;
  invitations: InvitationAPI;
};

type AfTestFixtures = {
  // Test-scoped: each test gets a fresh applet. Sharing one applet across
  // tests piles up in-progress submissions, which breaks the applet page.
  afApplet: AfApplet;
};

type AfWorkerApiFixtures = {
  afApi: AfApi;
};

export const test = sessionTest.extend<AfTestFixtures, AfWorkerApiFixtures>({
  afApi: [
    async ({ afUser }, use) => {
      const context = await afApiContext(afUser);
      const answers = new AnswerAPI(context);
      answers.setRespondent(
        getPrivateKey({ userId: afUser.id, email: afUser.email, password: afUser.password }),
      );

      await use({
        applets: new AppletAPI(context),
        events: new EventAPI(context),
        answers,
        assignments: new AssignmentAPI(context),
        invitations: new InvitationAPI(context),
      });
      await context.dispose();
    },
    { scope: 'worker' },
  ],

  afApplet: async ({ afUser, afApi }, use, testInfo) => {
    const owner = { userId: afUser.id, email: afUser.email, password: afUser.password };
    const ownerPrivateKey = getPrivateKey(owner);
    const encryption = buildAppletEncryption(owner);

    const displayName = `AF Resume w${testInfo.workerIndex} ${Date.now()}`;
    const created = await afApi.applets.createWorkspaceApplet(
      afUser.id,
      buildAfResumeAppletPayload({ displayName, encryption }),
    );

    const detail = (await afApi.applets.getAppletDetail(created.result.id)).result;
    const activityIdByName = new Map<string, string>(
      detail.activities.map((a: { name: string; id: string }) => [a.name, a.id]),
    );
    // Applet detail omits items; each activity detail carries them.
    const itemIdsByActivityId: Record<string, string[]> = {};
    for (const activity of detail.activities) {
      const activityDetail = (await afApi.applets.getActivity(activity.id)).result;
      itemIdsByActivityId[activity.id] = activityDetail.items.map(
        (item: { id: string }) => item.id,
      );
    }
    const flow = detail.activityFlows.find((f: { name: string }) => f.name === AF_FLOW_NAME);
    const manualFlow = detail.activityFlows.find(
      (f: { name: string }) => f.name === AF_MANUAL_FLOW_NAME,
    );

    await use({
      appletId: detail.id,
      displayName,
      version: detail.version,
      flowId: flow.id,
      manualFlowId: manualFlow.id,
      flowActivityIds: flow.activityIds,
      standaloneActivityIds: AF_STANDALONE_ACTIVITY_NAMES.map(
        (name) => activityIdByName.get(name)!,
      ),
      itemIdsByActivityId,
      ownerPrivateKey,
      appletPublicKey: JSON.parse(encryption.publicKey),
    });

    await afApi.applets.deleteApplet(detail.id);
  },
});

export { expect } from '@playwright/test';
