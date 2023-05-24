import {
  Activity,
  ActivityListItem,
  ActivityPipelineType,
  ActivityProgressPreview,
  ActivityStatus,
  ActivityType,
  CheckboxItem,
  RadioItem,
  SliderItem,
  TextItem,
  supportableItemTypes,
} from "../lib"
import { ActivityEventProgressRecord, SupportableActivities } from "./types"

import {
  ActivityDTO,
  ActivityItemDetailsDTO,
  AnswerTypesPayload,
  AppletDetailsActivityDTO,
  AppletEventsResponse,
  MultiSelectAnswerPayload,
  ScheduleEventDto,
  SingleSelectAnswerPayload,
  SliderAnswerPayload,
  TextAnswerPayload,
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
      config: {
        removeBackButton: true,
        skippableItem: true,
        imageSrc: splashScreen,
      },
      responseValues: null,
      answer: [],
    }
  }

  public convertToAnswers(items: Array<ActivityEventProgressRecord>): Array<AnswerTypesPayload> {
    const answers = items.map(item => {
      switch (item.responseType) {
        case "text":
          return this.convertToTextAnswer(item)

        case "singleSelect":
          return this.convertToSingleSelectAnswer(item)

        case "multiSelect":
          return this.convertToMultiSelectAnswer(item)

        case "slider":
          return this.convertToSliderAnswer(item)

        case "numberSelect":
          return null

        default:
          return null
      }
    })

    return answers.filter(x => x) as Array<AnswerTypesPayload>
  }

  private convertToTextAnswer(item: TextItem): TextAnswerPayload | null {
    if (!item.answer[0]) {
      return null
    }

    return {
      activityItemId: item.id,
      answer: {
        value: item.answer[0],
        shouldIdentifyResponse: !!item.config.responseDataIdentifier,
      },
    }
  }

  private convertToSingleSelectAnswer(item: RadioItem): SingleSelectAnswerPayload | null {
    if (!item.answer[0]) {
      return null
    }

    return {
      activityItemId: item.id,
      answer: {
        value: item.answer[0],
        additionalText: null,
      },
    }
  }

  private convertToMultiSelectAnswer(item: CheckboxItem): MultiSelectAnswerPayload | null {
    if (!item.answer[0]) {
      return null
    }

    return {
      activityItemId: item.id,
      answer: {
        value: item.answer,
        additionalText: null,
      },
    }
  }

  private convertToSliderAnswer(item: SliderItem): SliderAnswerPayload | null {
    if (!item.answer[0]) {
      return null
    }

    return {
      activityItemId: item.id,
      answer: {
        value: Number(item.answer[0]),
        additionalText: null,
      },
    }
  }
}

export const activityBuilder = new ActivityBuilder()
