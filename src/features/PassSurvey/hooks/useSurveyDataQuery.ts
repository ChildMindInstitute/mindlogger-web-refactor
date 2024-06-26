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

type Props = {
  publicAppletKey: string | null;
  appletId: string;
  activityId: string;
};

export const useSurveyDataQuery = (props: Props): Return => {
  const { appletId, activityId, publicAppletKey } = props;

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

  return {
    appletDTO: appletById?.result ?? null,
    respondentMeta: appletById?.respondentMeta,
    activityDTO: activityById ?? null,
    eventsDTO: eventsByIdData ?? null,
    isError: isAppletError || isActivityError || isEventsError,
    isLoading: isAppletLoading || isActivityLoading || isEventsLoading,
    error: appletError ?? activityError ?? eventsError,
  };
};
