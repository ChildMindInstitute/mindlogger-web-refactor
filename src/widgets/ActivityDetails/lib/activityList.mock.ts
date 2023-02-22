import { ActivityListItem, ActivityStatus, ActivityType } from "~/entities/activity"

export const mockActivityList: ActivityListItem[] = []

for (let i = 0; i < 5; i++) {
  mockActivityList.push({
    activityId: (i * 100 + i).toString(),
    eventId: "",
    activityFlowDetails: null,
    isInActivityFlow: true,
    type: ActivityType.NotDefined,
    image: null,
    //'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
    name: "Activity name " + (i + 1),
    description:
      "Description of item A Description of item B i i i i i i i Description of item Description of item Description of item " +
      i,
    isTimerSet: true,
    status: ActivityStatus.Scheduled,
    availableFrom: new Date(),
    availableTo: new Date(),
    scheduledAt: null,
    timeLeftToComplete: null,
    items: [],
  })
}
