import { useCallback } from 'react';

import { getActivityItemScreenId } from '../../lib';
import { mapItemAnswerToUserEventResponse } from '../mapper';
import { selectActivityProgress } from '../selectors';
import { actions } from '../slice';
import { ItemRecord, UserEventTypes } from '../types';

import { getProgressId } from '~/abstract/lib';
import { useAppDispatch, useAppSelector } from '~/shared/utils';

type Props = {
  activityId: string;
  eventId: string;
};

export const useUserEvents = (props: Props) => {
  const dispatch = useAppDispatch();

  const progressId = getProgressId(props.activityId, props.eventId);

  const activityProgress = useAppSelector((state) => selectActivityProgress(state, progressId));

  const saveUserEventByType = useCallback(
    (type: UserEventTypes, item: ItemRecord) => {
      const activityItemScreenId = getActivityItemScreenId(props.activityId, item.id);

      const newUserEvent = {
        type,
        screen: activityItemScreenId,
        time: Date.now(),
      };

      dispatch(
        actions.saveUserEvent({
          entityId: props.activityId,
          eventId: props.eventId,
          itemId: item.id,
          userEvent: newUserEvent,
        }),
      );

      return newUserEvent;
    },
    [dispatch, props.activityId, props.eventId],
  );

  const saveSetAnswerUserEvent = useCallback(
    (item: ItemRecord) => {
      if (!activityProgress) {
        return;
      }

      const userEvents = activityProgress.userEvents;

      const activityItemScreenId = getActivityItemScreenId(props.activityId, item.id);

      if (item.responseType === 'text' && userEvents.length > 0) {
        const lastUserEvent = userEvents[userEvents.length - 1];

        // We're only interested in updated the previous event if it is a text item
        // Otherwise we create a new event with the subsequent answer below
        if (lastUserEvent.screen === activityItemScreenId && lastUserEvent.type === 'SET_ANSWER') {
          return dispatch(
            actions.updateUserEventByIndex({
              entityId: props.activityId,
              eventId: props.eventId,
              userEventIndex: userEvents.length - 1,
              userEvent: {
                type: 'SET_ANSWER',
                screen: activityItemScreenId,
                time: Date.now(),
                response: item.answer[0],
              },
            }),
          );
        }
      }

      // In all cases besides the text item, we create a new event to reflect
      // the updated answer
      return dispatch(
        actions.saveUserEvent({
          entityId: props.activityId,
          eventId: props.eventId,
          itemId: item.id,
          userEvent: {
            type: 'SET_ANSWER',
            screen: activityItemScreenId,
            time: Date.now(),
            response: mapItemAnswerToUserEventResponse(item),
          },
        }),
      );
    },
    [activityProgress, dispatch, props.activityId, props.eventId],
  );

  const saveSetAdditionalTextUserEvent = useCallback(
    (item: ItemRecord) => {
      if (!activityProgress || item.additionalText === null || item.additionalText === undefined) {
        return;
      }

      const response = mapItemAnswerToUserEventResponse(item);

      if (typeof response !== 'object') {
        // This should never happen since text items don't have additional text
        // but the TS compiler doesn't know that
        return;
      }

      const userEvents = activityProgress.userEvents;

      const activityItemScreenId = getActivityItemScreenId(props.activityId, item.id);

      if (userEvents.length > 0) {
        const previousUserEvent = userEvents[userEvents.length - 1];

        if (
          previousUserEvent.screen === activityItemScreenId &&
          previousUserEvent.type === 'SET_ANSWER' &&
          typeof previousUserEvent.response === 'object' &&
          previousUserEvent.response.text !== undefined
        ) {
          // Update the text of the previous response if it contains text (to prevent incremental events)
          return dispatch(
            actions.updateUserEventByIndex({
              entityId: props.activityId,
              eventId: props.eventId,
              userEventIndex: userEvents.length - 1,
              userEvent: {
                type: 'SET_ANSWER',
                screen: activityItemScreenId,
                time: Date.now(),
                response: {
                  value: previousUserEvent.response.value,
                  text: item.additionalText,
                },
              },
            }),
          );
        }
      }

      // Create a new event in all other cases
      return dispatch(
        actions.saveUserEvent({
          entityId: props.activityId,
          eventId: props.eventId,
          itemId: item.id,
          userEvent: {
            type: 'SET_ANSWER',
            screen: activityItemScreenId,
            time: Date.now(),
            response,
          },
        }),
      );
    },
    [activityProgress, dispatch, props.activityId, props.eventId],
  );

  return { saveUserEventByType, saveSetAnswerUserEvent, saveSetAdditionalTextUserEvent };
};
