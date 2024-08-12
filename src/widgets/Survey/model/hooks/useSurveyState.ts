import { useMemo } from 'react';

import { appletModel } from '~/entities/applet';
import { PassSurveyModel } from '~/features/PassSurvey';

export const useSurveyState = (activityProgress: appletModel.ActivityProgress) => {
  const items = useMemo(() => activityProgress?.items ?? [], [activityProgress.items]);

  const availableItems = items.filter((x) => !x.isHidden);

  const { visibleItems, hiddenItemIds } =
    PassSurveyModel.conditionalLogicFilter.filter(availableItems);

  const step = activityProgress?.step ?? 0;

  const item = visibleItems[step];

  const hasNextStep = step < visibleItems.length - 1;

  const hasPrevStep = step > 0;

  const progress = useMemo(() => {
    const defaultProgressPercentage = 0;

    if (!availableItems) {
      return defaultProgressPercentage;
    }

    return ((step + 1) / availableItems.length) * 100;
  }, [availableItems, step]);

  return {
    item,
    conditionallyHiddenItemIds: hiddenItemIds,

    hasNextStep,
    hasPrevStep,
    step,

    progress,
  };
};
