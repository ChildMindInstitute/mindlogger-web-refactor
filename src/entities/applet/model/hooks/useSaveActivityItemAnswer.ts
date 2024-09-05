import { useCallback } from 'react';

import { actions } from '../slice';

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

  const removeItemAnswer = useCallback(
    (itemId: string) => {
      saveItemAnswer(itemId, []);
    },
    [saveItemAnswer],
  );

  return {
    saveItemAnswer,
    saveItemAdditionalText,
    removeItemAnswer,
  };
};
