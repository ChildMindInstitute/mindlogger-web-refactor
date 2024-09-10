import { selectGroupProgress } from '../selectors';

import { getProgressId, GroupProgress } from '~/abstract/lib';
import { useAppSelector } from '~/shared/utils';

type Props = {
  entityId: string;
  eventId: string;
  targetSubjectId: string | null;
};

export const useGroupProgressRecord = ({
  entityId,
  eventId,
  targetSubjectId,
}: Props): GroupProgress | null => {
  const record = useAppSelector((state) =>
    selectGroupProgress(state, getProgressId(entityId, eventId, targetSubjectId)),
  );

  return record ?? null;
};
