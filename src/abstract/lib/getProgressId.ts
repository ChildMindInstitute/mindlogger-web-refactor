import { GroupProgressId } from './types';

export const getProgressId = (
  entityId: string,
  eventId: string,
  targetSubjectId?: string | null,
): GroupProgressId => {
  return targetSubjectId ? `${entityId}/${eventId}/${targetSubjectId}` : `${entityId}/${eventId}`;
};

export const getDataFromProgressId = (
  progressId: GroupProgressId,
): { entityId: string; eventId: string; targetSubjectId: string | null } => {
  const [entityId, eventId, targetSubjectId = null] = progressId.split('/');

  return { entityId, eventId, targetSubjectId };
};
