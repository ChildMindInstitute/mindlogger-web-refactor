import { useCallback } from 'react';

import { mapItemToRecord, mapSplashScreenToRecord } from '../mapper';
import { activityProgressSelector } from '../selectors';
import { actions } from '../slice';
import { ActivityProgress, ItemRecord, UpdateSubStepPayload } from '../types';

import { getProgressId } from '~/abstract/lib';
import { ActivityDTO } from '~/shared/api';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

type SaveProgressProps = {
  activity: ActivityDTO;
  eventId: string;
  targetSubjectId: string | null;
};

type DefaultProps = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
};

export const useActivityProgress = () => {
  const dispatch = useAppDispatch();

  const activitiesProgressState = useAppSelector(activityProgressSelector);

  const getActivityProgress = useCallback(
    (props: DefaultProps): ActivityProgress | null => {
      const progress =
        activitiesProgressState[
          getProgressId(props.activityId, props.eventId, props.targetSubjectId)
        ];

      return progress ?? null;
    },
    [activitiesProgressState],
  );

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
          targetSubjectId: props.targetSubjectId,
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
          targetSubjectId: props.targetSubjectId,
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
          targetSubjectId: props.targetSubjectId,
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

  const setSubStep = useCallback(
    (props: UpdateSubStepPayload) => {
      dispatch(actions.setSubStep(props));
    },
    [dispatch],
  );

  return {
    getActivityProgress,
    setInitialProgress,
    removeActivityProgress,
    incrementStep,
    decrementStep,
    setSubStep,
    openSummaryScreen,
    closeSummaryScreen,
  };
};
