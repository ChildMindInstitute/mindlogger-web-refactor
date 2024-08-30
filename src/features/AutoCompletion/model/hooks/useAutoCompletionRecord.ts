import { selectAutoCompletionRecord } from '../selectors';
import { AutoCompletion } from '../slice';

import { getProgressId } from '~/abstract/lib';
import { useAppSelector } from '~/shared/utils';

type Props = {
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
};

export const useAutoCompletionRecord = ({
  entityId,
  eventId,
  targetSubjectId,
}: Props): AutoCompletion | null => {
  const state = useAppSelector((state) =>
    selectAutoCompletionRecord(state, getProgressId(entityId, eventId, targetSubjectId)),
  );

  return state ?? null;
};
