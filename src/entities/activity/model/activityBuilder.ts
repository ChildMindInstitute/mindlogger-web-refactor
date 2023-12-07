import {
  Activity,
  ActivityListItem,
  ActivityProgressPreview,
  ActivityStatus,
  ActivityType,
  supportableItemTypes,
} from "../lib"
import { ActivityEventProgressRecord, SupportableActivities } from "./types"

import { ActivityPipelineType } from "~/abstract/lib"
import {
  ActivityDTO,
  ActivityItemDetailsDTO,
  AppletDetailsActivityDTO,
  AppletEventsResponse,
  ScheduleEventDto,
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
    events?: AppletEventsResponse,
  ): ActivityListItem[] {
    if (!activities || !events) {
      return []
    }

    const eventMap = new Map<string, ScheduleEventDto>()
    events.events.forEach(event => {
      eventMap.set(event.entityId, event)
    })

    return activities.map((activity: AppletDetailsActivityDTO) => {
      const eventByActivityId = eventMap.get(activity.id)

      return {
        activityId: activity.id,
        flowId: null, // Mocked
        eventId: eventByActivityId?.id ?? "",
        name: activity.name,
        description: activity.description,
        image: activity.image,
        isOnePageAssessment: activity.showAllAtOnce,
        status: ActivityStatus.Available, // Mocked
        type: ActivityType.NotDefined, // Mocked
        isInActivityFlow: false, // Mocked
        isTimerSet: false, // Mocked
        isTimerElapsed: false, // Mocked
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
    return activities
      .filter(x => !x.isHidden)
      .map(activity => ({
        type: ActivityType.NotDefined,
        pipelineType: ActivityPipelineType.Regular,
        id: activity.id,
        name: activity.name,
        description: activity.description,
        image: activity.image,
        isHidden: activity.isHidden,
        order: activity.order,
      }))
  }

  public convertActivityItemToEmptyProgressRecord(item: ActivityItemDetailsDTO): ActivityEventProgressRecord {
    return {
      ...item,
      answer: [],
    }
  }

  public getSupportableActivitiesMap(activities: ActivityDTO[]): SupportableActivities | null {
    return activities.reduce<SupportableActivities>((acc, activity) => {
      const activityId = activity.id
      const itemTypes = activity.items.map(x => x.responseType)

      const isSupportable = itemTypes.reduce((acc, itemType) => {
        const isItemSupported = supportableItemTypes.includes(itemType)

        return acc && isItemSupported
      }, true)

      acc[activityId] = isSupportable

      return acc
    }, {})
  }

  public isSupportedActivity(activity: ActivityDTO | undefined) {
    if (!activity) {
      return false
    }

    return activity.items.every(item => supportableItemTypes.includes(item.responseType))
  }

  public convertSplashScreenToItem(splashScreen: string): ActivityEventProgressRecord {
    return {
      id: splashScreen,
      name: "",
      question: "",
      order: 0,
      responseType: "splashScreen",
      isHidden: false,
      config: {
        removeBackButton: true,
        skippableItem: true,
        imageSrc: splashScreen,
      },
      responseValues: null,
      answer: [],
      conditionalLogic: null,
    }
  }
}

export const activityBuilder = new ActivityBuilder()
