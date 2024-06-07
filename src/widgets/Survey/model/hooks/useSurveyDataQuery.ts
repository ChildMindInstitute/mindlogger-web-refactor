import { useContext } from 'react';

import { SurveyBasicContext } from '../../lib';

import { useActivityByIdQuery } from '~/entities/activity';
import { useAppletByIdQuery } from '~/entities/applet';
import { useEventsbyAppletIdQuery } from '~/entities/event';
import {
  ActivityDTO,
  AppletDTO,
  AppletEventsResponse,
  BaseError,
  RespondentMetaDTO,
} from '~/shared/api';

type Return = {
  appletDTO: AppletDTO | null;
  respondentMeta?: RespondentMetaDTO;
  activityDTO: ActivityDTO | null;
  eventsDTO: AppletEventsResponse | null;
  isError: boolean;
  isLoading: boolean;
  error: BaseError | null;
};

export const useSurveyDataQuery = (): Return => {
  const context = useContext(SurveyBasicContext);

  const {
    data: appletById,
    isError: isAppletError,
    isLoading: isAppletLoading,
    error: appletError,
  } = useAppletByIdQuery(
    context.isPublic
      ? { isPublic: context.isPublic, publicAppletKey: context.publicAppletKey }
      : { isPublic: context.isPublic, appletId: context.appletId },
  );

  const {
    data: activityById,
    isError: isActivityError,
    isLoading: isActivityLoading,
    error: activityError,
  } = useActivityByIdQuery({ isPublic: context.isPublic, activityId: context.activityId });

  const {
    data: eventsByIdData,
    isError: isEventsError,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useEventsbyAppletIdQuery(
    context.isPublic
      ? { isPublic: context.isPublic, publicAppletKey: context.publicAppletKey }
      : { isPublic: context.isPublic, appletId: context.appletId },
  );

  return {
    appletDTO: appletById?.data?.result ?? null,
    respondentMeta: appletById?.data?.respondentMeta,
    activityDTO: activityById?.data?.result ?? null,
    eventsDTO: eventsByIdData?.data?.result ?? null,
    isError: isAppletError || isActivityError || isEventsError,
    isLoading: isAppletLoading || isActivityLoading || isEventsLoading,
    error: appletError ?? activityError ?? eventsError,
  };
};
