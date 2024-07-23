import { useCallback, useContext } from 'react';

import { SurveyContext } from '../lib';
import AnswersConstructService from '../model/AnswersConstructService';

import { appletModel } from '~/entities/applet';
import { ActivityFlowDTO, AnswerPayload, EncryptionDTO, ScheduleEventDto } from '~/shared/api';
import { useAppSelector } from '~/shared/utils';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';

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
};

export interface AnswerBuilder {
  build: (params: BuildAnswerParams) => AnswerPayload;
}

export const useAnswerBuilder = (): AnswerBuilder => {
  const context = useContext(SurveyContext);

  const consents = useAppSelector(appletModel.selectors.selectConsents);

  const groupProgress = appletModel.hooks.useGroupProgressRecord({
    entityId: context.entityId,
    eventId: context.eventId,
  });

  const { getMultiInformantState, isInMultiInformantFlow } =
    appletModel.hooks.useMultiInformantState();

  const { featureFlags } = useFeatureFlags();

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
      });

      const answer = answerConstructService.construct();

      const isIntegrationsEnabled =
        context.integrations !== undefined && context.integrations !== null;

      if (isIntegrationsEnabled) {
        answer.consentToShare = true;
      }

      if (featureFlags.enableMultiInformant) {
        const multiInformantState = getMultiInformantState();
        if (isInMultiInformantFlow()) {
          answer.sourceSubjectId = multiInformantState?.sourceSubject?.id;
          answer.targetSubjectId = multiInformantState?.targetSubject?.id;
        }
      }

      return answer;
    },
    [
      groupProgress,
      context.event,
      context.appletId,
      context.appletVersion,
      context.flow,
      context.encryption,
      context.publicAppletKey,
      context.integrations,
      featureFlags.enableMultiInformant,
      getMultiInformantState,
      isInMultiInformantFlow,
    ],
  );

  return { build };
};
