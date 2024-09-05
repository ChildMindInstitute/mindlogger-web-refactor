import { ActivityGroupsBuildManager } from '../services/ActivityGroupsBuildManager';

import { ActivityListGroup } from '~/abstract/lib/GroupBuilder';
import { appletModel } from '~/entities/applet';
import { AppletBaseDTO, AppletEventsResponse, HydratedAssignmentDTO } from '~/shared/api';
import { useAppSelector } from '~/shared/utils';

type Props = {
  applet: AppletBaseDTO;
  events: AppletEventsResponse;
  assignments: HydratedAssignmentDTO[] | null;
};

type Return = {
  groups: ActivityListGroup[];
};

export const useActivityGroups = ({ applet, events, assignments }: Props): Return => {
  const groupsInProgress = useAppSelector(appletModel.selectors.groupProgressSelector);

  const { groups } = ActivityGroupsBuildManager.process({
    activities: applet.activities,
    flows: applet.activityFlows,
    events,
    assignments,
    entityProgress: groupsInProgress,
  });

  return { groups };
};
