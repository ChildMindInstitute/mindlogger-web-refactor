import { UseQueryResult } from '@tanstack/react-query';

import { useActivityByIdQuery } from '~/entities/activity';
import { useAppletByIdQuery } from '~/entities/applet';
import { useEventsbyAppletIdQuery } from '~/entities/event';
import { useSubjectQuery } from '~/entities/subject';
import {
  ActivityDTO,
  AppletDTO,
  AppletEventsResponse,
  BaseError,
  RespondentMetaDTO,
} from '~/shared/api';
import { SubjectDTO } from '~/shared/api/types/subject';
import { useFeatureFlags } from '~/shared/utils';

type Return = {
  appletDTO: AppletDTO | null;
  respondentMeta?: RespondentMetaDTO;
  activityDTO: ActivityDTO | null;
  eventsDTO: AppletEventsResponse | null;
  targetSubject: SubjectDTO | null;
  isError: boolean;
  isLoading: boolean;
  error: BaseError | null;
};

type Props = {
  publicAppletKey: string | null;
  appletId: string;
  activityId: string;
  targetSubjectId: string | null;
};

export const useSurveyDataQuery = (props: Props): Return => {
  const { appletId, activityId, publicAppletKey, targetSubjectId } = props;
  const { featureFlags } = useFeatureFlags();
  const isAssignmentsEnabled = !!featureFlags?.enableActivityAssign && !!targetSubjectId;

  const {
    data: appletById,
    isError: isAppletError,
    isLoading: isAppletLoading,
    error: appletError,
  } = useAppletByIdQuery(
    publicAppletKey ? { isPublic: true, publicAppletKey } : { isPublic: false, appletId },
    { select: (data) => data?.data },
  );

  const {
    data: activityById,
    isError: isActivityError,
    isLoading: isActivityLoading,
    error: activityError,
  } = useActivityByIdQuery(
    { isPublic: !!publicAppletKey, activityId },
    { select: (data) => data?.data?.result },
  );

  const {
    data: eventsByIdData,
    isError: isEventsError,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useEventsbyAppletIdQuery(
    publicAppletKey ? { isPublic: true, publicAppletKey } : { isPublic: false, appletId },
    { select: (data) => data?.data?.result },
  );

  const subjectQueryResult = useSubjectQuery(targetSubjectId, {
    select: (data) => data.data.result,
    enabled: isAssignmentsEnabled,
  });

  const {
    data: targetSubject,
    isError: isSubjectError,
    isLoading: isSubjectLoading,
    error: subjectError,
  } = isAssignmentsEnabled ? subjectQueryResult : ({} as UseQueryResult<SubjectDTO, BaseError>);

  return {
    appletDTO: appletById?.result ?? null,
    respondentMeta: appletById?.respondentMeta,
    activityDTO: activityById ?? null,
    eventsDTO: eventsByIdData ?? null,
    targetSubject: targetSubject ?? null,
    isError: isAppletError || isActivityError || isEventsError || isSubjectError,
    isLoading: isAppletLoading || isActivityLoading || isEventsLoading || isSubjectLoading,
    error: appletError ?? activityError ?? eventsError ?? subjectError,
  };
};
