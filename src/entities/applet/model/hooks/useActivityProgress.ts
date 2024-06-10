import { useCallback } from 'react';

import { mapItemToRecord, mapSplashScreenToRecord } from '../mapper';
import { actions } from '../slice';
import { ItemRecord } from '../types';

import { ActivityDTO } from '~/shared/api';
import { useAppDispatch } from '~/shared/utils';

type SaveProgressProps = {
  activity: ActivityDTO;
  eventId: string;
};

type DefaultProps = {
  activityId: string;
  eventId: string;
};

export const useActivityProgress = () => {
  const dispatch = useAppDispatch();

  const removeActivityProgress = useCallback(
    (props: DefaultProps) => {
      dispatch(actions.removeActivityProgress(props));
    },
    [dispatch],
  );

  const setInitialProgress = useCallback(
    (props: SaveProgressProps) => {
      const initialStep = 0;

      const isSplashScreenExist = !!props.activity.splashScreen;
      let splashScreenItem: ItemRecord | undefined;

      if (isSplashScreenExist) {
        splashScreenItem = mapSplashScreenToRecord(props.activity.splashScreen);
      }

      const preparedActivityItemProgressRecords = props.activity.items.map(mapItemToRecord);

      if (splashScreenItem) {
        preparedActivityItemProgressRecords.unshift(splashScreenItem);
      }

      return dispatch(
        actions.saveActivityProgress({
          activityId: props.activity.id,
          eventId: props.eventId,
          progress: {
            items: preparedActivityItemProgressRecords,
            step: initialStep,
            userEvents: [],
            isSummaryScreenOpen: false,
            scoreSettings: props.activity.scoresAndReports,
            itemTimer: {},
          },
        }),
      );
    },
    [dispatch],
  );

  const openSummaryScreen = useCallback(
    (props: DefaultProps) => {
      dispatch(
        actions.changeSummaryScreenVisibility({
          activityId: props.activityId,
          eventId: props.eventId,
          isSummaryScreenOpen: true,
        }),
      );
    },
    [dispatch],
  );

  const closeSummaryScreen = useCallback(
    (props: DefaultProps) => {
      dispatch(
        actions.changeSummaryScreenVisibility({
          activityId: props.activityId,
          eventId: props.eventId,
          isSummaryScreenOpen: false,
        }),
      );
    },
    [dispatch],
  );

  const incrementStep = useCallback(
    (props: DefaultProps) => {
      dispatch(actions.incrementStep(props));
    },
    [dispatch],
  );

  const decrementStep = useCallback(
    (props: DefaultProps) => {
      dispatch(actions.decrementStep(props));
    },
    [dispatch],
  );

  return {
    setInitialProgress,
    removeActivityProgress,
    incrementStep,
    decrementStep,
    openSummaryScreen,
    closeSummaryScreen,
  };
};
