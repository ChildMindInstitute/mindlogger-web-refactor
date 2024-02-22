import { useEffect } from "react"

import { hasAdditionalResponse } from "~/entities/activity/lib/helpers"
import { appletModel } from "~/entities/applet"
import { usePrevious } from "~/shared/utils"

type Props = {
  item: appletModel.ItemRecord
  hasNextStep: boolean
  onForward: () => void
}

export const useAutoForward = ({ item, onForward, hasNextStep }: Props) => {
  const prevItem = usePrevious(item)

  useEffect(() => {
    if (!item) {
      return
    }

    const isEqualItems = prevItem?.id === item.id

    if (!isEqualItems) {
      return
    }

    const isAnswerChanged = prevItem?.answer !== item.answer

    const isSingleSelect = item.responseType === "singleSelect"

    const isAutoForwardEnabled = isSingleSelect && item.config.autoAdvance

    const isHasAnswer = item.answer.length > 0

    // If there's an additional text field we probably shouldn't auto advance,
    // even if the field is populated
    const hasAdditionalTextField = hasAdditionalResponse(item)

    if (
      isSingleSelect &&
      isHasAnswer &&
      hasNextStep &&
      isAnswerChanged &&
      isAutoForwardEnabled &&
      !hasAdditionalTextField
    ) {
      onForward()
    }
  }, [hasNextStep, item, onForward, prevItem?.answer, prevItem?.id])
}
