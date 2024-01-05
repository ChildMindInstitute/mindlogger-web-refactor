import { useMemo } from "react"

import { appletModel } from "~/entities/applet"

export const useSurvey = (activityProgress: appletModel.ActivityProgress) => {
  const items = useMemo(() => activityProgress?.items ?? [], [activityProgress.items])

  const processedItems = appletModel.conditionalLogicBuilder.process(items)

  const step = activityProgress?.step ?? 0

  const item = processedItems[step]

  const hasNextStep = step < processedItems.length - 1

  const hasPrevStep = step > 0

  const progress = useMemo(() => {
    const defaultProgressPercentage = 0

    if (!items) {
      return defaultProgressPercentage
    }

    return ((step + 1) / items.length) * 100
  }, [items, step])

  return {
    item,

    hasNextStep,
    hasPrevStep,
    step,

    progress,
  }
}
