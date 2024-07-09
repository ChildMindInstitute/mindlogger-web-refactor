import { selectGroupProgress } from '../selectors';

import { getProgressId, GroupProgress } from '~/abstract/lib';
import { useAppSelector } from '~/shared/utils';

type Props = {
  entityId: string;
  eventId: string;
};

export const useGroupProgressRecord = ({ entityId, eventId }: Props): GroupProgress | null => {
  const record = useAppSelector((state) =>
    selectGroupProgress(state, getProgressId(entityId, eventId)),
  );

  return record ?? null;
};
