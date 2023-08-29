import { useCallback } from "react"

import { v4 as uuidV4 } from "uuid"

import { generateUserPublicKey } from "../generateUserPublicKey"
import { getFirstResponseDataIdentifierTextItem } from "../getFirstResponseDataIdentifierTextItem"
import { getScheduledTimeFromEvents } from "../getScheduledTimeFromEvents"
import { mapAlerts, mapToAnswers } from "../mappers"
import { prepareItemAnswers } from "../prepareItemAnswers"

import { ActivityPipelineType, activityModel, useEncryptPayload } from "~/entities/activity"
import { AnswerPayload, AppletDetailsDTO, AppletEventsResponse } from "~/shared/api"
import { getHHMM, getYYYYDDMM, secureUserPrivateKeyStorage, useEncryption } from "~/shared/utils"

type UseAnswerProps = {
  appletDetails: AppletDetailsDTO

  flowId: string | null
  activityId: string
  eventId: string

  eventsRawData: AppletEventsResponse
}

type SubmitAnswersProps = {
  items: activityModel.types.ActivityEventProgressRecord[]
  userEvents: activityModel.types.UserEvents[]
  isPublic: boolean
}

export const useAnswer = (props: UseAnswerProps) => {
  const { generateUserPrivateKey } = useEncryption()
  const { encryptePayload } = useEncryptPayload()

  const { getGroupInProgressByIds } = activityModel.hooks.useActivityGroupsInProgressState()

  const getSubmitId = useCallback((groupInProgress: activityModel.types.ProgressState): string => {
    const isFlow = groupInProgress.type === ActivityPipelineType.Flow

    return isFlow ? groupInProgress.executionGroupKey : uuidV4()
  }, [])

  const processAnswers = useCallback(
    (params: SubmitAnswersProps): AnswerPayload => {
      // Step 1 - Collect answers from store and transform to answer payload
      const itemAnswers = mapToAnswers(params.items)
      const preparedItemAnswers = prepareItemAnswers(itemAnswers)

      const preparedAlerts = mapAlerts(params.items)

      // Step 2 - Encrypt answers
      let privateKey: number[] | null = null

      if (params.isPublic) {
        privateKey = generateUserPrivateKey({ userId: uuidV4(), email: uuidV4(), password: uuidV4() })
      } else {
        privateKey = secureUserPrivateKeyStorage.getUserPrivateKey()
      }

      const userPublicKey = generateUserPublicKey(props.appletDetails.encryption, privateKey)

      const encryptedAnswers = encryptePayload(props.appletDetails.encryption, preparedItemAnswers.answer, privateKey)
      const encryptedUserEvents = encryptePayload(props.appletDetails.encryption, params.userEvents, privateKey)

      const groupInProgress = getGroupInProgressByIds({
        appletId: props.appletDetails.id,
        activityId: props.flowId ? props.flowId : props.activityId,
        eventId: props.eventId,
      })

      if (!groupInProgress) {
        throw new Error("[Activity item list] Group in progress not found")
      }

      const firstTextItemAnserWithIdentifier = getFirstResponseDataIdentifierTextItem(params.items)
      const encryptedIdentifier = firstTextItemAnserWithIdentifier
        ? encryptePayload(props.appletDetails.encryption, firstTextItemAnserWithIdentifier, privateKey)
        : null

      const now = new Date()

      const isFlow = groupInProgress.type === ActivityPipelineType.Flow
      const pipelineAcitivityOrder = isFlow ? groupInProgress.pipelineActivityOrder : null

      const currentFlow = props.appletDetails.activityFlows?.find(({ id }) => id === props.flowId)

      const currentFlowLength = currentFlow?.activityIds.length

      const isFlowCompleted =
        currentFlowLength && pipelineAcitivityOrder ? currentFlowLength === pipelineAcitivityOrder + 1 : false

      // Step 3 - Send answers to backend
      const answer: AnswerPayload = {
        appletId: props.appletDetails.id,
        activityId: props.activityId,
        flowId: props.flowId,
        submitId: getSubmitId(groupInProgress),
        version: props.appletDetails.version,
        createdAt: new Date().getTime(),
        isFlowCompleted: isFlow ? isFlowCompleted : true,
        answer: {
          answer: encryptedAnswers,
          itemIds: preparedItemAnswers.itemIds,
          events: encryptedUserEvents,
          userPublicKey,
          startTime: new Date(groupInProgress.startAt!).getTime(),
          endTime: new Date().getTime(),
          identifier: encryptedIdentifier,
          scheduledEventId: props.eventId,
          localEndDate: getYYYYDDMM(now),
          localEndTime: getHHMM(now),
        },
        alerts: preparedAlerts,
        client: {
          appId: "mindlogger-web",
          appVersion: import.meta.env.VITE_BUILD_VERSION,
          width: window.innerWidth,
          height: window.innerHeight,
        },
      }

      const scheduledTime = getScheduledTimeFromEvents(props.eventsRawData, props.activityId)
      if (scheduledTime) {
        answer.answer.scheduledTime = scheduledTime
      }

      return answer
    },
    [
      encryptePayload,
      generateUserPrivateKey,
      getGroupInProgressByIds,
      getSubmitId,
      props.activityId,
      props.appletDetails,
      props.eventId,
      props.eventsRawData,
      props.flowId,
    ],
  )

  return { processAnswers }
}
