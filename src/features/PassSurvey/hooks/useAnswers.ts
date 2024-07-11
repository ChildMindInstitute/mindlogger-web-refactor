import { useCallback, useContext } from 'react';

import { SurveyContext } from '../lib';
import AnswersConstructService from '../model/AnswersConstructService';

import { appletModel } from '~/entities/applet';
import { ActivityFlowDTO, AnswerPayload, EncryptionDTO, ScheduleEventDto } from '~/shared/api';
import { useAppSelector } from '~/shared/utils';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';

export type BuildAnswerParams = {
  event: ScheduleEventDto;

  entityId: string;
  activityId: string;
  appletId: string;
  appletVersion: string;

  encryption: EncryptionDTO | null;

  flow: ActivityFlowDTO | null;
  publicAppletKey: string | null;

  items: appletModel.ItemRecord[];

  userEvents: appletModel.UserEvent[];

  isFlowCompleted?: boolean;
};

export const useAnswer = () => {
  const context = useContext(SurveyContext);

  const consents = useAppSelector(appletModel.selectors.selectConsents);

  const groupProgress = appletModel.hooks.useGroupProgressRecord({
    entityId: context.entityId,
    eventId: context.eventId,
  });

  const { getMultiInformantState, isInMultiInformantFlow } =
    appletModel.hooks.useMultiInformantState();

  const { featureFlags } = useFeatureFlags();

  const buildAnswer = useCallback(
    (params: BuildAnswerParams): AnswerPayload => {
      if (!groupProgress) {
        throw new Error('[useAnswer:buildAnswer] Group progress is not found');
      }

      if (!params.encryption) {
        throw new Error('[useAnswer:buildAnswer] Encryption is not found');
      }

      const answerConstructService = new AnswersConstructService({
        groupProgress,
        userEvents: params.userEvents,
        items: params.items,
        event: params.event,
        activityId: params.activityId,
        appletId: params.appletId,
        appletVersion: params.appletVersion,
        flow: params.flow,
        encryption: params.encryption,
        publicAppletKey: params.publicAppletKey,
        isFlowCompleted: params.isFlowCompleted,
      });

      const answer = answerConstructService.build();

      const isIntegrationsEnabled = context.integrations !== undefined;

      const appletConsents = consents?.[context.appletId] ?? null;

      if (isIntegrationsEnabled) {
        answer.consentToShare = appletConsents?.shareToPublic ?? false;
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
      consents,
      context.appletId,
      context.integrations,
      featureFlags.enableMultiInformant,
      groupProgress,
      getMultiInformantState,
      isInMultiInformantFlow,
    ],
  );

  return { buildAnswer };
};
