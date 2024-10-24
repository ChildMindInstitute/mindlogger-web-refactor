import { UseQueryResult } from '@tanstack/react-query';

import { useActivityByIdQuery } from '~/entities/activity';
import { useAppletBaseInfoByIdQuery, useAppletByIdQuery } from '~/entities/applet';
import { useMyAssignmentsQuery } from '~/entities/assignment';
import { useEventsbyAppletIdQuery } from '~/entities/event';
import {
  ActivityDTO,
  AppletBaseDTO,
  AppletDTO,
  AppletEventsResponse,
  BaseError,
  RespondentMetaDTO,
} from '~/shared/api';
import { SubjectDTO } from '~/shared/api/types/subject';
import { useFeatureFlags } from '~/shared/utils';
import { FeatureFlag } from '~/shared/utils/types/featureFlags';

type Return = {
  appletDTO: AppletDTO | null;
  appletBaseDTO: AppletBaseDTO | null;
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
  const { featureFlag } = useFeatureFlags();

  const isAssignmentsEnabled =
    featureFlag(FeatureFlag.EnableActivityAssign, false) && !!appletId && !!targetSubjectId;

  const {
    data: appletById,
    isError: isAppletError,
    isLoading: isAppletLoading,
    error: appletError,
  } = useAppletByIdQuery(
    publicAppletKey ? { isPublic: true, publicAppletKey } : { isPublic: false, appletId },
    { select: ({ data }) => data },
  );

  const {
    data: appletBaseInfo,
    isError: isAppletBaseInfoError,
    isLoading: isAppletBaseInfoLoading,
    error: appletBaseInfoError,
  } = useAppletBaseInfoByIdQuery(
    publicAppletKey ? { isPublic: true, publicAppletKey } : { isPublic: false, appletId },
    { select: ({ data }) => data.result },
  );

  const {
    data: activityById,
    isError: isActivityError,
    isLoading: isActivityLoading,
    error: activityError,
  } = useActivityByIdQuery(
    { isPublic: !!publicAppletKey, activityId },
    { select: ({ data }) => data.result },
  );

  const {
    data: eventsByIdData,
    isError: isEventsError,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useEventsbyAppletIdQuery(
    publicAppletKey ? { isPublic: true, publicAppletKey } : { isPublic: false, appletId },
    { select: ({ data }) => data.result },
  );

  // Details of targetSubject are only guaranteed available from /users/me/assignments endpoint
  // (Unprivileged users do not have access to the /subjects endpoint directly)
  const assignmentsResult = useMyAssignmentsQuery(
    isAssignmentsEnabled ? props.appletId : undefined,
    {
      select: ({ data }) =>
        data.result.assignments.find(({ targetSubject: { id } }) => id === targetSubjectId)
          ?.targetSubject,
      enabled: isAssignmentsEnabled,
    },
  );

  const {
    data: targetSubject,
    isError: isSubjectError,
    isLoading: isSubjectLoading,
    error: subjectError,
  } = isAssignmentsEnabled ? assignmentsResult : ({} as UseQueryResult<SubjectDTO, BaseError>);

  return {
    appletDTO: appletById?.result ?? null,
    appletBaseDTO: appletBaseInfo ?? null,
    respondentMeta: appletById?.respondentMeta,
    activityDTO: activityById ?? null,
    eventsDTO: eventsByIdData ?? null,
    targetSubject: targetSubject ?? null,
    isError:
      isAppletError || isAppletBaseInfoError || isActivityError || isEventsError || isSubjectError,
    isLoading:
      isAppletLoading ||
      isAppletBaseInfoLoading ||
      isActivityLoading ||
      isEventsLoading ||
      isSubjectLoading,
    error: appletError ?? appletBaseInfoError ?? activityError ?? eventsError ?? subjectError,
  };
};
