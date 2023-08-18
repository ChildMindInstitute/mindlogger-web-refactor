import { useCallback } from "react"

import { v4 as uuidV4 } from "uuid"

import { generateUserPublicKey } from "../generateUserPublicKey"
import { getFirstResponseDataIdentifierTextItem } from "../getFirstResponseDataIdentifierTextItem"
import { getScheduledTimeFromEvents } from "../getScheduledTimeFromEvents"
import { mapAlerts, mapToAnswers } from "../mappers"
import { prepareItemAnswers } from "../prepareItemAnswers"

import { activityModel, useEncryptPayload } from "~/entities/activity"
import { AnswerPayload, AppletEncryptionDTO, AppletEventsResponse } from "~/shared/api"
import { getHHMM, getYYYYDDMM, secureUserPrivateKeyStorage, useEncryption } from "~/shared/utils"

type UseAnswerProps = {
  appletId: string
  appletVersion: string
  appletEncryption: AppletEncryptionDTO | null

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

      const userPublicKey = generateUserPublicKey(props.appletEncryption, privateKey)

      const encryptedAnswers = encryptePayload(props.appletEncryption, preparedItemAnswers.answer, privateKey)
      const encryptedUserEvents = encryptePayload(props.appletEncryption, params.userEvents, privateKey)

      const groupInProgress = getGroupInProgressByIds({
        appletId: props.appletId,
        activityId: props.activityId,
        eventId: props.eventId,
      })

      if (!groupInProgress) {
        throw new Error("[Activity item list] Group in progress not found")
      }

      const firstTextItemAnserWithIdentifier = getFirstResponseDataIdentifierTextItem(params.items)
      const encryptedIdentifier = firstTextItemAnserWithIdentifier
        ? encryptePayload(props.appletEncryption, firstTextItemAnserWithIdentifier, privateKey)
        : null

      const now = new Date()

      // Step 3 - Send answers to backend
      const answer: AnswerPayload = {
        appletId: props.appletId,
        version: props.appletVersion,
        flowId: null,
        activityId: props.activityId,
        submitId: uuidV4(),
        isFlowCompleted: false,
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
      props.activityId,
      props.appletEncryption,
      props.appletId,
      props.appletVersion,
      props.eventId,
      props.eventsRawData,
    ],
  )

  return { processAnswers }
}
