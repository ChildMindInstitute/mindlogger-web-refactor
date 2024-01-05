import { useMemo } from "react"

import { appletModel } from "~/entities/applet"

export const useSurvey = (activityProgress: appletModel.ActivityProgress) => {
  const rawItems = useMemo(() => activityProgress?.items ?? [], [activityProgress])

  const items = appletModel.conditionalLogicBuilder.process(rawItems)

  const step = activityProgress?.step ?? 0

  const item = items[step]

  const itemHasAnswer = item?.answer.length > 0

  const hasNextStep = step < items.length - 1

  const hasPrevStep = step > 0

  const canMoveNext = hasNextStep && itemHasAnswer

  const progress = useMemo(() => {
    const defaultProgressPercentage = 0

    if (!rawItems) {
      return defaultProgressPercentage
    }

    return ((step + 1) / rawItems.length) * 100
  }, [rawItems, step])

  return {
    rawItems,

    items,
    item,

    hasNextStep,
    hasPrevStep,
    step,
    canMoveNext,

    progress,
  }
}
