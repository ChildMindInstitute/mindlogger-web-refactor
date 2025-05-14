import { useCallback } from 'react';

import { actions } from '../slice';
import { ItemRecord } from '../types';

import { Answer } from '~/entities/activity';
import { useAppDispatch } from '~/shared/utils';

type Props = {
  activityId: string;
  eventId: string;
  targetSubjectId: string | null;
};

export const useSaveItemAnswer = ({ activityId, eventId, targetSubjectId }: Props) => {
  const dispatch = useAppDispatch();

  const saveItemAnswer = useCallback(
    (itemId: string, answer: Answer) => {
      dispatch(
        actions.saveItemAnswer({
          entityId: activityId,
          eventId,
          targetSubjectId,
          itemId,
          answer,
        }),
      );
    },
    [dispatch, activityId, eventId, targetSubjectId],
  );

  const saveItemAdditionalText = useCallback(
    (itemId: string, additionalText: string) => {
      dispatch(
        actions.saveAdditionalText({
          entityId: activityId,
          eventId,
          targetSubjectId,
          itemId,
          additionalText,
        }),
      );
    },
    [dispatch, activityId, eventId, targetSubjectId],
  );

  const saveItemCustomProperty = useCallback(
    <T extends ItemRecord>(itemId: string, customProperty: keyof T, value: T[keyof T]) => {
      dispatch(
        actions.saveCustomProperty({
          entityId: activityId,
          eventId,
          targetSubjectId,
          itemId,
          customProperty: customProperty as string,
          value,
        }),
      );
    },
    [dispatch, activityId, eventId, targetSubjectId],
  );

  const removeItemAnswer = useCallback(
    (itemId: string) => {
      saveItemAnswer(itemId, []);
    },
    [saveItemAnswer],
  );

  return {
    saveItemAnswer,
    saveItemAdditionalText,
    saveItemCustomProperty,
    removeItemAnswer,
  };
};
