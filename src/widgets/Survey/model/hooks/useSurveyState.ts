import { useMemo } from 'react';

import { appletModel } from '~/entities/applet';
import { PassSurveyModel } from '~/features/PassSurvey';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';
import { FeatureFlag } from '~/shared/utils/types/featureFlags';

export const useSurveyState = (activityProgress: appletModel.ActivityProgress | null) => {
  const { featureFlag } = useFeatureFlags();

  const items = useMemo(() => activityProgress?.items ?? [], [activityProgress?.items]);

  const availableItems = items.filter((item) => {
    if (item.isHidden) {
      return false;
    }

    if (item.responseType === 'phrasalTemplate') {
      return featureFlag(FeatureFlag.EnablePhrasalTemplate, false);
    }

    return true;
  });

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
