import { useCallback, useContext } from 'react';

import { SurveyContext } from '../lib';
import AnswersConstructService from '../model/AnswersConstructService';

import { ActivityPipelineType, FlowProgress } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { ProlificUrlParamsPayload as ProlificUrlParams } from '~/entities/applet/model';
import { ActivityFlowDTO, AnswerPayload, EncryptionDTO, ScheduleEventDto } from '~/shared/api';

export type BuildAnswerParams = {
  activityId: string;
  items: appletModel.ItemRecord[];
  userEvents: appletModel.UserEvent[];

  event?: ScheduleEventDto;
  entityId?: string;
  appletId?: string;
  appletVersion?: string;
  isFlowCompleted?: boolean;
  publicAppletKey?: string | null;
  encryption?: EncryptionDTO | null;
  flow?: ActivityFlowDTO | null;

  prolificParams?: ProlificUrlParams;
};

export interface AnswerBuilder {
  build: (params: BuildAnswerParams) => AnswerPayload;
}

export const useAnswerBuilder = (): AnswerBuilder => {
  const context = useContext(SurveyContext);

  const groupProgress = appletModel.hooks.useGroupProgressRecord({
    entityId: context.entityId,
    eventId: context.eventId,
    targetSubjectId: context.targetSubject?.id ?? null,
  });

  const { getMultiInformantState, isInMultiInformantFlow } =
    appletModel.hooks.useMultiInformantState();

  const build = useCallback(
    (params: BuildAnswerParams): AnswerPayload => {
      if (!groupProgress) {
        throw new Error('[useAnswer:buildAnswer] Group progress is not found');
      }

      const encryption = params.encryption ?? context.encryption;

      if (!encryption) {
        throw new Error('[useAnswer:buildAnswer] Encryption is not found');
      }

      const resolvedVersion =
        params.appletVersion ?? groupProgress.appletVersion ?? context.appletVersion;

      const resolvedFlow = params.flow ?? context.flow;

      // For deleted flows, context.flow is null but context.entityId still
      // holds the original flow ID (from the URL / groupProgress key).
      const resolvedFlowId =
        resolvedFlow?.id ??
        (groupProgress.type === ActivityPipelineType.Flow ? context.entityId : null);

      let versionSource = 'context';
      if (params.appletVersion) versionSource = 'params';
      else if (groupProgress.appletVersion) versionSource = 'groupProgress';
      const flowProgress = groupProgress as FlowProgress;
      console.info(
        `[DEBUG-FLOW] useAnswerBuilder.build\n` +
          `  activityId=${params.activityId}\n` +
          `  resolvedVersion=${resolvedVersion}\n` +
          `  versionSource=${versionSource}\n` +
          `  resolvedFlowId=${resolvedFlowId ?? 'null'}\n` +
          `  groupProgress.submitId=${groupProgress.submitId}\n` +
          `  groupProgress.pipelineActivityOrder=${flowProgress?.pipelineActivityOrder ?? 'N/A'}\n` +
          `  groupProgress.flowActivityIds=${JSON.stringify(flowProgress?.flowActivityIds ?? null)}\n` +
          `  groupProgress.appletVersion=${groupProgress.appletVersion ?? 'none'}\n` +
          `  context.appletVersion=${context.appletVersion}\n` +
          `  isFlowCompleted param=${params.isFlowCompleted ?? 'undefined'}`,
      );

      const answerConstructService = new AnswersConstructService({
        groupProgress,
        userEvents: params.userEvents,
        items: params.items,
        event: params.event ?? groupProgress.event ?? context.event,
        activityId: params.activityId,
        appletId: params.appletId ?? context.appletId,
        // Use the version stored in progress to match the version from when the session started
        appletVersion: resolvedVersion,
        flow: resolvedFlow,
        flowId: resolvedFlowId,
        encryption,
        publicAppletKey: params.publicAppletKey ?? context.publicAppletKey,
        isFlowCompleted: params.isFlowCompleted,
        prolificParams: params.prolificParams,
      });

      const answer = answerConstructService.construct();

      const isIntegrationsEnabled =
        context.integrations !== undefined && context.integrations !== null;

      if (isIntegrationsEnabled) {
        answer.consentToShare = true;
      }

      const multiInformantState = getMultiInformantState();
      if (isInMultiInformantFlow()) {
        // Take Now flow
        answer.sourceSubjectId = multiInformantState?.sourceSubject?.id;
        answer.targetSubjectId = multiInformantState?.targetSubject?.id;
      } else if (context.targetSubject) {
        // Activity assignment
        answer.targetSubjectId = context.targetSubject.id;
      }

      return answer;
    },
    [
      groupProgress,
      context.encryption,
      context.event,
      context.appletId,
      context.appletVersion,
      context.entityId,
      context.flow,
      context.publicAppletKey,
      context.integrations,
      context.targetSubject,
      getMultiInformantState,
      isInMultiInformantFlow,
    ],
  );

  return { build };
};
