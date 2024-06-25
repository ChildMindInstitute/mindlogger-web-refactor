import { useCallback, useContext } from 'react';

import { SurveyContext } from '../lib';
import AnswersConstructService from '../model/AnswersConstructService';

import { appletModel } from '~/entities/applet';
import { ActivityFlowDTO, AnswerPayload, EncryptionDTO, ScheduleEventDto } from '~/shared/api';
import { useAppSelector } from '~/shared/utils';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';

type BuildAnswerParams = {
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
};

export const useAnswer = () => {
  const context = useContext(SurveyContext);

  const consents = useAppSelector(appletModel.selectors.selectConsents);

  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const { getMultiInformantState, isInMultiInformantFlow } =
    appletModel.hooks.useMultiInformantState();

  const { featureFlags } = useFeatureFlags();

  const buildAnswer = useCallback(
    (params: BuildAnswerParams): AnswerPayload => {
      const groupProgress = getGroupProgress({
        entityId: params.entityId,
        eventId: params.event.id,
      });

      if (!groupProgress) {
        throw new Error('[useAnswer] Group progress is not found');
      }

      if (!params.encryption) {
        throw new Error('[useAnswer] Encryption is not found');
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
      });

      const answer = answerConstructService.build();

      const isIntegrationsEnabled = context.integrations !== undefined;

      const appletConsents = consents?.[context.appletId] ?? null;

      if (isIntegrationsEnabled) {
        answer.isDataShare = appletConsents?.shareToPublic ?? false;
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
      getGroupProgress,
      getMultiInformantState,
      isInMultiInformantFlow,
    ],
  );

  return { buildAnswer };
};
