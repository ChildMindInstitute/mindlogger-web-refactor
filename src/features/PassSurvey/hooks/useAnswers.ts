import { useCallback, useContext } from 'react';

import { SurveyContext } from '../lib';
import AnswersConstructService from '../model/AnswersConstructService';

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

      const answerConstructService = new AnswersConstructService({
        groupProgress,
        userEvents: params.userEvents,
        items: params.items,
        event: params.event ?? context.event,
        activityId: params.activityId,
        appletId: params.appletId ?? context.appletId,
        appletVersion: params.appletVersion ?? context.appletVersion,
        flow: params.flow ?? context.flow,
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
