import { isToday } from "date-fns"

import {
  Activity,
  ActivityFlow,
  ActivityFlowProgress,
  ActivityGroupType,
  ActivityGroupTypeNames,
  ActivityListGroup,
  ActivityPipelineType,
  EntityProgress,
  EventActivity,
  ProgressPayload,
} from "../../lib"

import { ActivityListItem, ActivityStatus, ActivityType } from "~/entities/activity"
import { AvailabilityType } from "~/entities/event"
import {
  HourMinute,
  getMsFromHours,
  getMsFromMinutes,
  MS_IN_MINUTE,
  MINUTES_IN_HOUR,
  MIDNIGHT_DATE,
  isTimeInInterval,
} from "~/shared/utils"

export interface IActivityGroupsBuilder {
  buildInProgress: (eventsActivities: Array<EventActivity>) => ActivityListGroup
  buildAvailable: (eventsActivities: Array<EventActivity>) => ActivityListGroup
  buildScheduled: (eventsActivities: Array<EventActivity>) => ActivityListGroup
}

class ActivityGroupsBuilder implements IActivityGroupsBuilder {
  private progress: EntityProgress

  private appletId: string

  private activities: Activity[]

  constructor(inputParams: ActivityGroupsBuilderInput) {
    this.progress = inputParams.progress
    this.activities = inputParams.allAppletActivities
    this.appletId = inputParams.appletId
  }

  private getNow = () => new Date()

  private getProgressRecord(eventActivity: EventActivity): ProgressPayload | null {
    const record = this.progress[this.appletId][eventActivity.activity.id][eventActivity.event.id]
    return record ?? null
  }

  private isInProgress(eventActivity: EventActivity): boolean {
    const record = this.getProgressRecord(eventActivity)
    if (!record) {
      return false
    }
    return !!record.startAt && !record.endAt
  }

  private getStartedDateTime(eventActivity: EventActivity): Date {
    const record = this.getProgressRecord(eventActivity)!
    return record.startAt!
  }

  private populateActivityFlowFields(item: ActivityListItem, activityEvent: EventActivity) {
    const activityFlow = activityEvent.activity as ActivityFlow

    item.isInActivityFlow = true
    item.activityFlowDetails = {
      showActivityFlowBadge: !activityFlow.hideBadge,
      activityFlowName: activityFlow.name,
      numberOfActivitiesInFlow: activityFlow.items.length,
      activityPositionInFlow: 0,
    }

    const isInProgress = this.isInProgress(activityEvent)

    let activity: Activity, position: number

    if (isInProgress) {
      const progressRecord = this.getProgressRecord(activityEvent) as ActivityFlowProgress

      activity = this.activities.find(x => x.id === progressRecord.currentActivityId)!
      position = activityFlow.items.findIndex(x => x.activityId === activity.id) + 1
    } else {
      activity = this.activities.find(x => x.id === activityFlow.items[0].activityId)!
      position = 1
    }

    item.activityFlowDetails.activityPositionInFlow = position
    item.name = activity.name
    item.description = activity.description
    item.type = activity.type
    item.image = activity.image
  }

  private getTimeToComplete(eventActivity: EventActivity): HourMinute {
    const { event } = eventActivity
    const timer = event.timers!.timer!

    const startedTime = this.getStartedDateTime(eventActivity)

    const activityDuration: number = getMsFromHours(timer.hours) + getMsFromMinutes(timer.minutes)

    const alreadyElapsed: number = new Date().getTime() - startedTime.getTime()

    if (alreadyElapsed < activityDuration) {
      const left: number = activityDuration - alreadyElapsed

      const hours = Math.floor(left / MS_IN_MINUTE / MINUTES_IN_HOUR)
      const minutes = Math.round((left - getMsFromHours(hours)) / MS_IN_MINUTE)

      return { hours, minutes }
    } else {
      return { hours: 0, minutes: 0 }
    }
  }

  private createListItem(eventActivity: EventActivity) {
    const { activity, event } = eventActivity
    const { pipelineType } = eventActivity.activity
    const isFlow = pipelineType === ActivityPipelineType.Flow

    const item: ActivityListItem = {
      activityId: activity.id,
      eventId: event.id,
      name: isFlow ? "" : activity.name,
      description: isFlow ? "" : activity.description,
      type: isFlow ? ActivityType.NotDefined : (activity as Activity).type,
      image: isFlow ? null : activity.image,
      status: ActivityStatus.NotDefined,
      isTimerSet: false,
      timeLeftToComplete: null,
      isInActivityFlow: false,
      isReviewable: false,
      isSkippable: false,
      splashScreen: "",
      responseIsEditable: false,
      showAllAtOnce: false,
      ordering: 0,
      items: [],
    }

    if (isFlow) {
      this.populateActivityFlowFields(item, eventActivity)
    }
    return item
  }

  /*
  Public methods
  */

  public buildInProgress(eventsActivities: Array<EventActivity>): ActivityListGroup {
    const filtered = eventsActivities.filter(x => this.isInProgress(x))

    const activityItems: Array<ActivityListItem> = []

    for (const eventActivity of filtered) {
      const item = this.createListItem(eventActivity)

      item.status = ActivityStatus.InProgress

      const { event } = eventActivity
      item.isTimerSet = !!event.timers?.timer
      item.timeLeftToComplete = item.isTimerSet ? this.getTimeToComplete(eventActivity) : null

      activityItems.push(item)
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.InProgress],
      type: ActivityGroupType.InProgress,
    }

    return result
  }

  public buildAvailable(eventsActivities: Array<EventActivity>): ActivityListGroup {
    const notInProgress = eventsActivities.filter(x => !this.isInProgress(x))

    const now = this.getNow()

    const filtered: Array<EventActivity> = []

    const activityItems: Array<ActivityListItem> = []

    for (const eventActivity of notInProgress) {
      const { event } = eventActivity

      const isAlwaysAvailable = event.availability.availabilityType === AvailabilityType.AlwaysAvailable

      const isScheduled = event.availability.availabilityType === AvailabilityType.ScheduledAccess

      const oneTimeCompletion = event.availability.oneTimeCompletion

      const progressRecord = this.getProgressRecord(eventActivity)

      const endAt = progressRecord?.endAt

      const completedToday = !!endAt && isToday(endAt)

      const neverCompleted = !progressRecord

      const scheduledToday = isToday(event.scheduledAt!)

      const isCurrentTimeInTimeWindow = isScheduled
        ? isTimeInInterval(
            { hours: now.getHours(), minutes: now.getMinutes() },
            event.availability.timeFrom!,
            event.availability.timeTo!,
          )
        : null

      const conditionForAlwaysAvailable =
        isAlwaysAvailable && ((oneTimeCompletion && neverCompleted) || !oneTimeCompletion)

      const conditionForScheduled =
        isScheduled && scheduledToday && now > event.scheduledAt! && isCurrentTimeInTimeWindow && !completedToday

      if (conditionForAlwaysAvailable || conditionForScheduled) {
        filtered.push(eventActivity)
      }
    }

    for (const eventActivity of filtered) {
      const item = this.createListItem(eventActivity)

      item.status = ActivityStatus.Available

      const { event } = eventActivity

      if (event.availability.availabilityType === AvailabilityType.ScheduledAccess) {
        const to = this.getNow()
        to.setHours(event.availability.timeTo!.hours)
        to.setMinutes(event.availability.timeTo!.minutes)
        item.availableTo = to
      } else {
        item.availableTo = MIDNIGHT_DATE
      }

      activityItems.push(item)
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.Available],
      type: ActivityGroupType.Available,
    }

    return result
  }

  public buildScheduled(eventsActivities: Array<EventActivity>): ActivityListGroup {
    const notInProgress = eventsActivities.filter(x => !this.isInProgress(x))

    const activityItems: Array<ActivityListItem> = []

    const filtered: Array<EventActivity> = []

    const now = this.getNow()

    for (const eventActivity of notInProgress) {
      const { event } = eventActivity

      const typeIsScheduled = event.availability.availabilityType === AvailabilityType.ScheduledAccess

      const accessBeforeTimeFrom = event.availability.allowAccessBeforeFromTime

      const endAt = this.getProgressRecord(eventActivity)?.endAt

      const completedToday = !!endAt && isToday(endAt)

      const scheduledToday = isToday(event.scheduledAt!)

      if (typeIsScheduled && scheduledToday && now < event.scheduledAt! && !accessBeforeTimeFrom && !completedToday) {
        filtered.push(eventActivity)
      }
    }

    for (const eventActivity of filtered) {
      const item = this.createListItem(eventActivity)

      item.status = ActivityStatus.Scheduled

      const { event } = eventActivity

      const from = this.getNow()
      from.setHours(event.availability.timeFrom!.hours)
      from.setMinutes(event.availability.timeFrom!.minutes)

      const to = this.getNow()
      to.setHours(event.availability.timeTo!.hours)
      to.setMinutes(event.availability.timeTo!.minutes)

      item.availableFrom = from
      item.availableTo = to

      activityItems.push(item)
    }

    const result: ActivityListGroup = {
      activities: activityItems,
      name: ActivityGroupTypeNames[ActivityGroupType.Scheduled],
      type: ActivityGroupType.Scheduled,
    }

    return result
  }
}

type ActivityGroupsBuilderInput = {
  allAppletActivities: Activity[]
  progress: EntityProgress
  appletId: string
}

export const createActivityGroupsBuilder = (inputData: ActivityGroupsBuilderInput): ActivityGroupsBuilder => {
  return new ActivityGroupsBuilder(inputData)
}