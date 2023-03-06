import {
  Activity,
  ActivityDetails,
  ActivityListItem,
  ActivityPipelineType,
  ActivityProgressPreview,
  ActivityStatus,
  ActivityType,
  EntityProgress,
  ProgressPayload,
} from "../lib"
import { ActivityProgressState } from "./types"

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

  public convertToActivitiesGroupsBuilder(activities: AppletDetailsActivityDTO[]): Activity[] {
    return activities.map(activity => ({
      type: ActivityType.NotDefined,
      pipelineType: ActivityPipelineType.Regular,
      id: activity.id,
      name: activity.name,
      description: activity.description,
      image: activity.image,
    }))
  }

  public convertToActivityInProgressGroupsBuilder(activities: ActivityProgressState): EntityProgress {
    return activities.reduce((acc, el) => {
      const entityProgressRecord: ProgressPayload = {
        startAt: el.startAt,
        endAt: el.endAt,
        type: ActivityPipelineType.Regular, // Mocked
      }

      acc[el.appletId] = {
        ...(acc[el.appletId] ?? {}),
        [el.activityId]: {
          ...(acc[el.appletId]?.[el.activityId] ?? {}),
          [el.eventId]: {
            ...entityProgressRecord,
          },
        },
      }

      return acc
    }, {} as EntityProgress)
  }
}

export const activityBuilder = new ActivityBuilder()
