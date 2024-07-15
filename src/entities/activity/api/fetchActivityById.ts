import { ActivityApiProxyService, ActivityDTO } from '~/shared/api';

type Props = {
  activityId: string;
  isPublic: boolean;
};

export const fetchActivityById = async ({ activityId, isPublic }: Props): Promise<ActivityDTO> => {
  let activityDTO: ActivityDTO | undefined;

  try {
    const response = await ActivityApiProxyService.getActivityById(activityId, {
      isPublic,
    });

    activityDTO = response.data.result;
  } catch (error) {
    console.error(error);
    throw new Error(`[fetchActivityById.ts] Error while fetching activity by ID: ${activityId}`);
  }

  return activityDTO;
};
