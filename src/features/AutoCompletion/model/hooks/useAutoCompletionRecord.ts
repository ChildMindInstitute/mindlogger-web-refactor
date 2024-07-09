import { selectAutoCompletionRecord } from '../selectors';

import { getProgressId } from '~/abstract/lib';
import { useAppSelector } from '~/shared/utils';

type Props = {
  entityId: string;
  eventId: string;
};

export const useAutoCompletionRecord = ({ entityId, eventId }: Props) => {
  const state = useAppSelector((state) =>
    selectAutoCompletionRecord(state, getProgressId(entityId, eventId)),
  );

  return state;
};
