import {
  Activity,
  ActivityListItem,
  ActivityPipelineType,
  ActivityProgressPreview,
  ActivityStatus,
  ActivityType,
} from "../lib"
import { ActivityEventProgressRecord } from "./types"

import {
  ActivityDTO,
  ActivityItemDetailsDTO,
  AppletDetailsActivityDTO,
  EventDTO,
  EventsByAppletIdResponseDTO,
} from "~/shared/api"

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

  public convertToActivityDetails(activity?: ActivityDTO): ActivityDTO | null {
    if (!activity) {
      return null
    }

    return activity
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

  public convertActivityItemToEmptyProgressRecord(item: ActivityItemDetailsDTO): ActivityEventProgressRecord {
    return {
      ...item,
      answer: [],
    }
  }

  public convertSplashScreenToItem(splashScreen: string): ActivityEventProgressRecord {
    return {
      id: splashScreen,
      name: splashScreen,
      question: splashScreen,
      order: 0,
      responseType: "splashScreen",
      config: {
        removeBackButton: true,
        skippableItem: false,
        imageSrc: splashScreen,
      },
      responseValues: null,
      answer: [],
    }
  }
}

export const activityBuilder = new ActivityBuilder()
