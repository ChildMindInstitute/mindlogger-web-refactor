import { useMemo } from "react"

import { appletModel } from "~/entities/applet"

export const useSurvey = (activityProgress: appletModel.ActivityProgress) => {
  const items = useMemo(() => activityProgress?.items ?? [], [activityProgress.items])

  const visibleItems = items.filter(x => !x.isHidden)

  const processedItems = appletModel.conditionalLogicBuilder.process(visibleItems)

  const visibleItemIds = visibleItems.map(x => x.id)
  const processedItemIds = processedItems.map(x => x.id)

  const conditionallyHiddenItemIds = visibleItemIds.filter(id => !processedItemIds.includes(id))

  const step = activityProgress?.step ?? 0

  const item = processedItems[step]

  const hasNextStep = step < processedItems.length - 1

  const hasPrevStep = step > 0

  const progress = useMemo(() => {
    const defaultProgressPercentage = 0

    if (!visibleItems) {
      return defaultProgressPercentage
    }

    return ((step + 1) / visibleItems.length) * 100
  }, [visibleItems, step])

  return {
    item,
    conditionallyHiddenItemIds,

    hasNextStep,
    hasPrevStep,
    step,

    progress,
  }
}
