import {
  Activity,
  ActivityDetails,
  ActivityItem,
  ActivityListItem,
  ActivityPipelineType,
  ActivityProgressPreview,
  ActivityStatus,
  ActivityType,
} from "../lib"
import { ActivityEventProgressRecord } from "./types"

import { ActivityDTO, AppletDetailsActivityDTO, EventDTO, EventsByAppletIdResponseDTO } from "~/shared/api"

class ActivityBuilder {
  public convertToActivityProgressPreview(activities: ActivityListItem[]): ActivityProgressPreview[] {
    return activities.map(activity => {
      return {
        id: activity.activityId,
        title: activity.name,
        activityId: activity.activityId,
        eventId: activity.eventId,
      }
    })
  }

  public convertToActivityList(
    activities?: AppletDetailsActivityDTO[],
    events?: EventsByAppletIdResponseDTO,
  ): ActivityListItem[] {
    if (!activities || !events) {
      return []
    }

    const eventMap = new Map<string, EventDTO>()
    events.events.forEach(event => {
      eventMap.set(event.entityId, event)
    })

    return activities.map((activity: AppletDetailsActivityDTO) => {
      const eventByActivityId = eventMap.get(activity.id)

      return {
        activityId: activity.id,
        eventId: eventByActivityId?.id ?? "",
        name: activity.name,
        description: activity.description,
        image: activity.image,
        isOnePageAssessment: activity.showAllAtOnce,
        status: ActivityStatus.Available, // Mocked
        type: ActivityType.NotDefined, // Mocked
        isInActivityFlow: false, // Mocked
        isTimerSet: false, // Mocked
      }
    })
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

  public convertActivityItemToEmptyProgressRecord(item: ActivityItem): ActivityEventProgressRecord {
    return {
      id: item.id,
      question: item.question,
      type: item.responseType,
      answer: [],
      config: {
        isSkippable: item.isSkippable ? item.isSkippable : false,
        isRandom: item.isRandom ? item.isRandom : false,
        isAbleToMoveToPrevious: item.isAbleToMoveToPrevious ? item.isAbleToMoveToPrevious : false,
        hasTextResponse: item.hasTextResponse,
        ordering: item.ordering,
      },
    }
  }
}

export const activityBuilder = new ActivityBuilder()
