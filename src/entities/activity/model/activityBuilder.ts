import {
  Activity,
  ActivityDetails,
  ActivityListItem,
  ActivityPipelineType,
  ActivityProgressPreview,
  ActivityType,
  supportableItemTypes,
} from "../lib"
import { ActivityEventProgressRecord, SupportableActivities } from "./types"

import { ActivityDTO, ActivityItemDetailsDTO, AppletDetailsActivityDTO } from "~/shared/api"

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
    if (item.responseType === "message") {
      return {
        ...item,
        config: {
          ...item.config,
          skippableItem: false,
        },
        answer: [],
      }
    }

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

  public isSupportedActivity(activity: ActivityDetails | undefined) {
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
