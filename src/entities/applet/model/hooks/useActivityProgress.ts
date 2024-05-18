import { useCallback } from 'react';

import { mapItemToRecord, mapSplashScreenToRecord, mapSummaryScreenToRecord } from '../mapper';
import { actions } from '../slice';
import { ItemRecord } from '../types';

import { ActivityDTO } from '~/shared/api';
import { useAppDispatch } from '~/shared/utils';

type SaveProgressProps = {
  activity: ActivityDTO;
  eventId: string;
};

type UpdateStepProps = {
  activityId: string;
  eventId: string;
};

export const useActivityProgress = () => {
  const dispatch = useAppDispatch();

  const setInitialProgress = useCallback(
    (props: SaveProgressProps) => {
      const initialStep = 0;

      const isSplashScreenExist = !!props.activity.splashScreen;
      let splashScreenItem: ItemRecord | undefined;

      if (isSplashScreenExist) {
        splashScreenItem = mapSplashScreenToRecord(props.activity.splashScreen);
      }

      const isSummaryScreenExist = props.activity.scoresAndReports?.showScoreSummary;

      let summaryScreenItem: ItemRecord | undefined;

      if (isSummaryScreenExist) {
        summaryScreenItem = mapSummaryScreenToRecord(props.activity.scoresAndReports.reports);
      }

      const preparedActivityItemProgressRecords = props.activity.items.map(mapItemToRecord);

      if (splashScreenItem) {
        preparedActivityItemProgressRecords.unshift(splashScreenItem);
      }

      if (summaryScreenItem) {
        preparedActivityItemProgressRecords.push(summaryScreenItem);
      }

      return dispatch(
        actions.saveActivityProgress({
          activityId: props.activity.id,
          eventId: props.eventId,
          progress: {
            items: preparedActivityItemProgressRecords,
            step: initialStep,
            userEvents: [],
          },
        }),
      );
    },
    [dispatch],
  );

  const incrementStep = useCallback(
    (props: UpdateStepProps) => {
      dispatch(actions.incrementStep(props));
    },
    [dispatch],
  );

  const decrementStep = useCallback(
    (props: UpdateStepProps) => {
      dispatch(actions.decrementStep(props));
    },
    [dispatch],
  );

  return {
    setInitialProgress,
    incrementStep,
    decrementStep,
  };
};
