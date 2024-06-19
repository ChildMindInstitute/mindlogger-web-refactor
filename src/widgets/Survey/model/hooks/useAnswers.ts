import { useCallback, useContext } from 'react';

import { v4 as uuidV4 } from 'uuid';

import { SurveyBasicContext, SurveyContext } from '../../lib';
import { generateUserPublicKey } from '../generateUserPublicKey';
import { getFirstResponseDataIdentifierTextItem } from '../getFirstResponseDataIdentifierTextItem';
import { getScheduledTimeFromEvents } from '../getScheduledTimeFromEvents';
import { mapAlerts, mapToAnswers } from '../mappers';
import { prepareItemAnswers } from '../prepareItemAnswers';

import { ActivityPipelineType, GroupProgress } from '~/abstract/lib';
import { useEncryptPayload } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { userModel } from '~/entities/user';
import { AnswerPayload } from '~/shared/api';
import { formatToDtoDate, formatToDtoTime, useAppSelector, useEncryption } from '~/shared/utils';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';

type SubmitAnswersProps = {
  items: appletModel.ItemRecord[];
  userEvents: appletModel.UserEvents[];
  isPublic: boolean;
};

export const useAnswer = () => {
  const { generateUserPrivateKey } = useEncryption();
  const { encryptPayload } = useEncryptPayload();

  const surveyBasicContext = useContext(SurveyBasicContext);
  const surveyContext = useContext(SurveyContext);

  const consents = useAppSelector(appletModel.selectors.selectConsents);

  const appletConsents = consents?.[surveyContext.appletId] ?? null;

  const { getGroupProgress } = appletModel.hooks.useGroupProgressState();
  const { getMultiInformantState, isInMultiInformantFlow } =
    appletModel.hooks.useMultiInformantState();
  const { featureFlags } = useFeatureFlags();

  const getSubmitId = (groupInProgress: GroupProgress): string => {
    const isFlow = groupInProgress.type === ActivityPipelineType.Flow;

    return isFlow ? groupInProgress.executionGroupKey : uuidV4();
  };

  const processAnswers = useCallback(
    (params: SubmitAnswersProps): AnswerPayload => {
      // Step 1 - Collect answers from store and transform to answer payload
      const itemAnswers = mapToAnswers(params.items);
      const preparedItemAnswers = prepareItemAnswers(itemAnswers);

      const preparedAlerts = mapAlerts(params.items);

      // Step 2 - Encrypt answers
      let privateKey: number[] | null = null;

      if (params.isPublic) {
        privateKey = generateUserPrivateKey({
          userId: uuidV4(),
          email: uuidV4(),
          password: uuidV4(),
        });
      } else {
        privateKey = userModel.secureUserPrivateKeyStorage.getUserPrivateKey();
      }

      const userPublicKey = generateUserPublicKey(surveyContext.encryption, privateKey);

      const encryptedAnswers = encryptPayload(
        surveyContext.encryption,
        preparedItemAnswers.answer,
        privateKey,
      );
      const encryptedUserEvents = encryptPayload(
        surveyContext.encryption,
        params.userEvents,
        privateKey,
      );

      const groupProgress = getGroupProgress({
        entityId: surveyBasicContext.flowId
          ? surveyBasicContext.flowId
          : surveyBasicContext.activityId,
        eventId: surveyBasicContext.eventId,
      });

      if (!groupProgress) {
        throw new Error('[Activity item list] Group in progress not found');
      }

      const firstTextItemAnserWithIdentifier = getFirstResponseDataIdentifierTextItem(params.items);
      const encryptedIdentifier = firstTextItemAnserWithIdentifier
        ? encryptPayload(surveyContext.encryption, firstTextItemAnserWithIdentifier, privateKey)
        : null;

      const now = new Date();

      const isFlow = groupProgress.type === ActivityPipelineType.Flow;
      const pipelineAcitivityOrder = isFlow ? groupProgress.pipelineActivityOrder : null;

      const currentFlowLength = surveyContext.flow?.activityIds.length;

      const isFlowCompleted =
        currentFlowLength && pipelineAcitivityOrder
          ? currentFlowLength === pipelineAcitivityOrder + 1
          : false;

      // Step 3 - Send answers to backend
      const answer: AnswerPayload = {
        appletId: surveyContext.appletId,
        activityId: surveyBasicContext.activityId,
        flowId: surveyBasicContext.flowId,
        submitId: getSubmitId(groupProgress),
        version: surveyContext.appletVersion,
        createdAt: new Date().getTime(),
        isFlowCompleted: isFlow ? isFlowCompleted : true,
        answer: {
          answer: encryptedAnswers,
          itemIds: preparedItemAnswers.itemIds,
          events: encryptedUserEvents,
          userPublicKey,
          startTime: new Date(groupProgress.startAt ?? Date.now()).getTime(),
          endTime: new Date().getTime(),
          identifier: encryptedIdentifier,
          scheduledEventId: surveyBasicContext.eventId,
          localEndDate: formatToDtoDate(now),
          localEndTime: formatToDtoTime(now),
        },
        alerts: preparedAlerts,
        client: {
          appId: 'mindlogger-web',
          appVersion: import.meta.env.VITE_BUILD_VERSION,
          width: window.innerWidth,
          height: window.innerHeight,
        },
      };

      const isIntegrationsEnabled = surveyContext.integrations !== undefined;

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

      const scheduledTime = getScheduledTimeFromEvents(surveyContext.event);

      if (scheduledTime) {
        answer.answer.scheduledTime = scheduledTime;
      }

      return answer;
    },
    [
      encryptPayload,
      getGroupProgress,
      surveyBasicContext,
      surveyContext,
      appletConsents,
      featureFlags.enableMultiInformant,
      generateUserPrivateKey,
      getMultiInformantState,
      isInMultiInformantFlow,
    ],
  );

  return { processAnswers };
};
