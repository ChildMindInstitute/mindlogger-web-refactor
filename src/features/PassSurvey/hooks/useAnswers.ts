import { useContext } from 'react';

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

  userDoneEvent?: appletModel.UserEvent;
};

export const useAnswer = () => {
  const context = useContext(SurveyContext);

  const consents = useAppSelector(appletModel.selectors.selectConsents);

  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();

  const { getActivityProgress } = appletModel.hooks.useActivityProgress();

  const { getMultiInformantState, isInMultiInformantFlow } =
    appletModel.hooks.useMultiInformantState();

  const { featureFlags } = useFeatureFlags();

  const buildAnswer = (params: BuildAnswerParams): AnswerPayload => {
    const groupProgress = getGroupProgress({
      entityId: params.entityId,
      eventId: params.event.id,
    });

    const activityProgress = getActivityProgress({
      activityId: params.activityId,
      eventId: params.event.id,
    });

    if (!groupProgress) {
      throw new Error('[useAnswer] Group progress is not found');
    }

    if (!activityProgress) {
      throw new Error('[useAnswer] Activity progress is not found');
    }

    if (!params.encryption) {
      throw new Error('[useAnswer] Encryption is not found');
    }

    let userEvents = activityProgress.userEvents;

    if (params.userDoneEvent) {
      userEvents = [...userEvents, params.userDoneEvent];
    }

    const answerConstructService = new AnswersConstructService({
      groupProgress,
      userEvents,
      items: activityProgress.items,
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
  };

  return { buildAnswer };
};
