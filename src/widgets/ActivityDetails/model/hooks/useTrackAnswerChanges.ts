import { useCallback, useEffect } from "react"

import { appletModel } from "~/entities/applet"
import { eventEmitter } from "~/shared/utils"

type Props = {
  activityId: string
  eventId: string
  items: appletModel.ItemRecord[]
}

type EventEmitterPayload = {
  item: appletModel.ItemRecord
}

export const useTrackAnswerChanges = ({ items, activityId, eventId }: Props) => {
  const { saveItemAnswer } = appletModel.hooks.useSaveItemAnswer({
    activityId,
    eventId,
  })

  const onItemAnswerChanged = useCallback(
    (props?: Record<string, unknown>) => {
      if (!props) return

      const { item } = props as EventEmitterPayload

      const itemIndex = items.findIndex(({ id }) => id === item.id)

      for (let i = itemIndex + 1; i < items.length; i++) {
        const item = items[i]

        if (!item) continue
        if (!item.conditionalLogic) continue
        if (item.answer.length === 0) continue

        const isValid = appletModel.conditionalLogicBuilder.validate(item)

        if (!isValid) {
          saveItemAnswer(i, [])
        }
      }
    },
    [items, saveItemAnswer],
  )

  useEffect(() => {
    eventEmitter.on("onItemAnswerChanged", onItemAnswerChanged)

    return () => {
      eventEmitter.off("onItemAnswerChanged", onItemAnswerChanged)
    }
  }, [onItemAnswerChanged])
}
