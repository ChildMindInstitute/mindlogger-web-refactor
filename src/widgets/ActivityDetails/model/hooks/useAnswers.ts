import { useCallback } from 'react';

import { v4 as uuidV4 } from 'uuid';

import { generateUserPublicKey } from '../generateUserPublicKey';
import { getFirstResponseDataIdentifierTextItem } from '../getFirstResponseDataIdentifierTextItem';
import { getScheduledTimeFromEvents } from '../getScheduledTimeFromEvents';
import { mapAlerts, mapToAnswers } from '../mappers';
import { prepareItemAnswers } from '../prepareItemAnswers';

import { ActivityPipelineType, GroupProgress } from '~/abstract/lib';
import { useEncryptPayload } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { userModel } from '~/entities/user';
import { AnswerPayload, AppletDetailsDTO, AppletEventsResponse } from '~/shared/api';
import { formatToDtoDate, formatToDtoTime, useAppSelector, useEncryption } from '~/shared/utils';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';

type Props = {
  applet: AppletDetailsDTO;

  flowId: string | null;
  activityId: string;
  eventId: string;

  eventsRawData: AppletEventsResponse;
};

type SubmitAnswersProps = {
  items: appletModel.ItemRecord[];
  userEvents: appletModel.UserEvents[];
  isPublic: boolean;
};

export const useAnswer = (props: Props) => {
  const { generateUserPrivateKey } = useEncryption();
  const { encryptPayload } = useEncryptPayload();

  const consents = useAppSelector(appletModel.selectors.selectConsents);

  const appletConsents = consents?.[props.applet.id];

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

      const userPublicKey = generateUserPublicKey(props.applet.encryption, privateKey);

      const encryptedAnswers = encryptPayload(
        props.applet.encryption,
        preparedItemAnswers.answer,
        privateKey,
      );
      const encryptedUserEvents = encryptPayload(
        props.applet.encryption,
        params.userEvents,
        privateKey,
      );

      const groupProgress = getGroupProgress({
        entityId: props.flowId ? props.flowId : props.activityId,
        eventId: props.eventId,
      });

      if (!groupProgress) {
        throw new Error('[Activity item list] Group in progress not found');
      }

      const firstTextItemAnserWithIdentifier = getFirstResponseDataIdentifierTextItem(params.items);
      const encryptedIdentifier = firstTextItemAnserWithIdentifier
        ? encryptPayload(props.applet.encryption, firstTextItemAnserWithIdentifier, privateKey)
        : null;

      const now = new Date();

      const isFlow = groupProgress.type === ActivityPipelineType.Flow;
      const pipelineAcitivityOrder = isFlow ? groupProgress.pipelineActivityOrder : null;

      const currentFlow = props.applet.activityFlows?.find(({ id }) => id === props.flowId);

      const currentFlowLength = currentFlow?.activityIds.length;

      const isFlowCompleted =
        currentFlowLength && pipelineAcitivityOrder
          ? currentFlowLength === pipelineAcitivityOrder + 1
          : false;

      // Step 3 - Send answers to backend
      const answer: AnswerPayload = {
        appletId: props.applet.id,
        activityId: props.activityId,
        flowId: props.flowId,
        submitId: getSubmitId(groupProgress),
        version: props.applet.version,
        createdAt: new Date().getTime(),
        isFlowCompleted: isFlow ? isFlowCompleted : true,
        isDataShare: appletConsents?.shareToPublic ?? false,
        answer: {
          answer: encryptedAnswers,
          itemIds: preparedItemAnswers.itemIds,
          events: encryptedUserEvents,
          userPublicKey,
          startTime: new Date(groupProgress.startAt ?? Date.now()).getTime(),
          endTime: new Date().getTime(),
          identifier: encryptedIdentifier,
          scheduledEventId: props.eventId,
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

      if (featureFlags.enableMultiInformant) {
        const multiInformantState = getMultiInformantState();
        if (isInMultiInformantFlow()) {
          answer.sourceSubjectId = multiInformantState?.sourceSubject?.id;
          answer.targetSubjectId = multiInformantState?.targetSubject?.id;
        }
      }

      const scheduledTime = getScheduledTimeFromEvents(props.eventsRawData, props.activityId);
      if (scheduledTime) {
        answer.answer.scheduledTime = scheduledTime;
      }

      return answer;
    },
    [
      props,
      encryptPayload,
      getGroupProgress,
      appletConsents?.shareToPublic,
      featureFlags.enableMultiInformant,
      generateUserPrivateKey,
      getMultiInformantState,
      isInMultiInformantFlow,
    ],
  );

  return { processAnswers };
};
