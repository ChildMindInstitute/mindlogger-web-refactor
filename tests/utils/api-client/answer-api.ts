import { encryptData, getAesKey, getPublicKey } from '../encryption';
import { CuriousApi } from './api';

// Seeds server-side answer state via POST /answers, mirroring the payload the
// web app builds in src/features/PassSurvey/model/AnswersConstructService.ts.

// Only the applet fields this file needs (kept local so this file has no
// import from the fixtures folder, which itself imports this class).
type SeedableApplet = {
  appletId: string;
  version: string;
  flowId: string;
  flowActivityIds: string[];
  itemIdsByActivityId: Record<string, string[]>;
  appletPublicKey: number[];
};

export type SeedOptions = {
  submitId: string;
  eventId: string;
  eventVersion?: string;
  targetSubjectId?: string;
  // Epoch ms; defaults keep start < end < now.
  startTime?: number;
  endTime?: number;
};

const pad = (n: number) => String(n).padStart(2, '0');
const toLocalDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toLocalTime = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

export class AnswerAPI extends CuriousApi {
  // Respondent key material, derived once via setRespondent().
  private privateKey: number[] = [];

  setRespondent(privateKey: number[]) {
    this.privateKey = privateKey;
  }

  // Submits one activity answer; flow progress = repeated calls sharing submitId.
  async submitActivityAnswer(
    applet: SeedableApplet,
    activityId: string,
    options: SeedOptions & { flowId?: string; isFlowCompleted?: boolean },
  ): Promise<void> {
    const aesKey = getAesKey(this.privateKey, applet.appletPublicKey);
    const endTime = options.endTime ?? Date.now();
    const endDate = new Date(endTime);

    const payload = {
      appletId: applet.appletId,
      activityId,
      flowId: options.flowId ?? null,
      submitId: options.submitId,
      version: applet.version,
      createdAt: endTime,
      isFlowCompleted: options.flowId ? (options.isFlowCompleted ?? false) : true,
      targetSubjectId: options.targetSubjectId,
      answer: {
        answer: encryptData(JSON.stringify([{ value: 0 }]), aesKey),
        itemIds: applet.itemIdsByActivityId[activityId],
        events: encryptData('[]', aesKey),
        userPublicKey: JSON.stringify(getPublicKey(this.privateKey)),
        startTime: options.startTime ?? endTime - 60_000,
        endTime,
        identifier: null,
        scheduledEventId: options.eventId,
        localEndDate: toLocalDate(endDate),
        localEndTime: toLocalTime(endDate),
      },
      alerts: [],
      client: { appId: 'mindlogger-web', appVersion: 'af-resume-suite', width: 1920, height: 1080 },
      ...(options.eventVersion && { eventHistoryId: `${options.eventId}_${options.eventVersion}` }),
    };

    const response = await this.apiContext.post('/answers', { data: payload });
    if (!response.ok()) {
      throw new Error(`Failed to submit answer: ${response.status()} ${await response.text()}`);
    }
  }

  // Seeds partial flow progress: first `completedActivities` of the flow answered.
  async seedFlowProgress(
    applet: SeedableApplet,
    completedActivities: number,
    options: SeedOptions & { flowId?: string },
  ): Promise<void> {
    for (let i = 0; i < completedActivities; i++) {
      await this.submitActivityAnswer(applet, applet.flowActivityIds[i], {
        ...options,
        flowId: options.flowId ?? applet.flowId,
        isFlowCompleted: false,
        endTime: (options.endTime ?? Date.now()) - (completedActivities - 1 - i) * 1000,
      });
    }
  }

  // Completes the whole flow under one submitId.
  async completeFlow(
    applet: SeedableApplet,
    options: SeedOptions & { flowId?: string },
  ): Promise<void> {
    for (let i = 0; i < applet.flowActivityIds.length; i++) {
      const isLast = i === applet.flowActivityIds.length - 1;
      await this.submitActivityAnswer(applet, applet.flowActivityIds[i], {
        ...options,
        flowId: options.flowId ?? applet.flowId,
        isFlowCompleted: isLast,
      });
    }
  }

  async getCompletedEntities(
    appletId: string,
    version: string,
    fromDate: string,
    includeInProgress = true,
  ): Promise<any> {
    const response = await this.apiContext.get(`/answers/applet/${appletId}/completions`, {
      params: { version, fromDate, includeInProgress: String(includeInProgress) },
    });
    if (!response.ok()) {
      throw new Error(`Failed to fetch completions: ${response.status()} ${await response.text()}`);
    }
    return await response.json();
  }
}
