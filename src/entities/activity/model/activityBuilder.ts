import { ActivityDetails, ActivityListItem, ActivityProgressPreview, ActivityStatus, ActivityType } from "../lib"

import { ActivityDTO, AppletDetailsActivityDTO } from "~/shared/api"
import { getRandomInt } from "~/shared/utils"

class ActivityBuilder {
  public convertToActivityProgressPreview(activities: ActivityListItem[]): ActivityProgressPreview[] {
    return activities.map(activity => {
      const itemsLength = 10 // activity.items.length in the real implementation
      const currentProgressItem = getRandomInt(10) // TODO: When redux for progress will implemented, add selector to progress activity and get activity order

      return {
        id: activity.activityId,
        title: activity.name,
        progress: (currentProgressItem / itemsLength) * 100,
      }
    })
  }

  public convertToActivityList(activities?: AppletDetailsActivityDTO[]): ActivityListItem[] {
    if (!activities) {
      return []
    }

    return activities.map((activity: AppletDetailsActivityDTO, index) => ({
      activityId: activity.id,
      eventId: `mock_eventid_${index}`, // Mocked
      name: activity.name,
      description: activity.description,
      image: activity.image,
      status: ActivityStatus.Available, // Mocked
      type: ActivityType.NotDefined, // Mocked
      isInActivityFlow: false, // Mocked
      isTimerSet: false, // Mocked
    }))
  }

  public convertToActivityDetails(activity?: ActivityDTO): ActivityDetails | null {
    if (!activity) {
      return null
    }

    return {
      id: activity.id,
      name: activity.name,
      description: activity.description,
      image: activity.image,
      splashScreen: activity.splashScreen,
      showAllAtOnce: activity.showAllAtOnce,
      isSkippable: activity.isSkippable,
      isReviewable: activity.isReviewable,
      responseIsEditable: activity.responseIsEditable,
      ordering: activity.ordering,
      items: activity.items,
    }
  }
}

export const activityBuilder = new ActivityBuilder()
