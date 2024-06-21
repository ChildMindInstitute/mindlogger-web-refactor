import { useCallback, useContext } from 'react';

import { v4 as uuidV4 } from 'uuid';

import { SurveyContext } from '../../../widgets/Survey/lib';
import { generateUserPublicKey } from '../../../widgets/Survey/model/generateUserPublicKey';
import { getFirstResponseDataIdentifierTextItem } from '../../../widgets/Survey/model/getFirstResponseDataIdentifierTextItem';
import { getScheduledTimeFromEvents } from '../../../widgets/Survey/model/getScheduledTimeFromEvents';
import { mapAlerts, mapToAnswers } from '../../../widgets/Survey/model/mappers';
import { prepareItemAnswers } from '../../../widgets/Survey/model/prepareItemAnswers';

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

  const context = useContext(SurveyContext);

  const consents = useAppSelector(appletModel.selectors.selectConsents);

  const appletConsents = consents?.[context.appletId] ?? null;

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

      const userPublicKey = generateUserPublicKey(context.encryption, privateKey);

      const encryptedAnswers = encryptPayload(
        context.encryption,
        preparedItemAnswers.answer,
        privateKey,
      );
      const encryptedUserEvents = encryptPayload(context.encryption, params.userEvents, privateKey);

      const groupProgress = getGroupProgress({
        entityId: context.entityId,
        eventId: context.eventId,
      });

      if (!groupProgress) {
        throw new Error('[Activity item list] Group in progress not found');
      }

      const firstTextItemAnserWithIdentifier = getFirstResponseDataIdentifierTextItem(params.items);
      const encryptedIdentifier = firstTextItemAnserWithIdentifier
        ? encryptPayload(context.encryption, firstTextItemAnserWithIdentifier, privateKey)
        : null;

      const now = new Date();

      const isFlow = groupProgress.type === ActivityPipelineType.Flow;
      const pipelineAcitivityOrder = isFlow ? groupProgress.pipelineActivityOrder : null;

      const currentFlowLength = context.flow?.activityIds.length;

      const isFlowCompleted =
        currentFlowLength && pipelineAcitivityOrder
          ? currentFlowLength === pipelineAcitivityOrder + 1
          : false;

      // Step 3 - Send answers to backend
      const answer: AnswerPayload = {
        appletId: context.appletId,
        activityId: context.activityId,
        flowId: context.flow?.id ?? null,
        submitId: getSubmitId(groupProgress),
        version: context.appletVersion,
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
          scheduledEventId: context.eventId,
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

      const isIntegrationsEnabled = context.integrations !== undefined;

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

      const scheduledTime = getScheduledTimeFromEvents(context.event);

      if (scheduledTime) {
        answer.answer.scheduledTime = scheduledTime;
      }

      return answer;
    },
    [
      context.encryption,
      context.entityId,
      context.eventId,
      context.flow?.activityIds.length,
      context.flow?.id,
      context.appletId,
      context.activityId,
      context.appletVersion,
      context.integrations,
      context.event,
      encryptPayload,
      getGroupProgress,
      featureFlags.enableMultiInformant,
      generateUserPrivateKey,
      appletConsents?.shareToPublic,
      getMultiInformantState,
      isInMultiInformantFlow,
    ],
  );

  return { processAnswers };
};
