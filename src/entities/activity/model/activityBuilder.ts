import {
  Activity,
  ActivityListItem,
  ActivityPipelineType,
  ActivityProgressPreview,
  ActivityStatus,
  ActivityType,
} from "../lib"
import { ActivityEventProgressRecord, CheckboxItem, TextItem, UnsupportableItem } from "./types"

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

  public convertActivityItemToEmptyProgressRecord(item: ActivityItemDetailsDTO): ActivityEventProgressRecord | null {
    const itemWithEmptyAnswer = {
      ...item,
      answer: [],
    }

    switch (item.responseType) {
      case "text":
        return itemWithEmptyAnswer as TextItem

      case "multiSelect":
        return itemWithEmptyAnswer as CheckboxItem

      default:
        return null
    }
  }
}

export const activityBuilder = new ActivityBuilder()
