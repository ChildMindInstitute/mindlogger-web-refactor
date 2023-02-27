import { ActivityGroupType, ActivityGroupTypeNames, ActivityListGroup } from "../../lib"

import { ActivityListItem, ActivityType, ActivityStatus } from "~/entities/activity"

const groupMocks: ActivityListGroup[] = []

for (let i = 0; i < 3; i++) {
  const activities: ActivityListItem[] = []

  groupMocks.push({
    activities,
    type: (i + 1) as ActivityGroupType,
    name: ActivityGroupTypeNames[(i + 1) as ActivityGroupType],
  })

  for (let j = 0; j < 5; j++) {
    activities.push({
      activityId: (i * 100 + j).toString(),
      eventId: "",
      activityFlowDetails: null,
      isInActivityFlow: true,
      type: ActivityType.NotDefined,
      image: null,
      //'https://raw.githubusercontent.com/mtg137/Stability_tracker_applet/master/protocols/stability/mindlogger-logo.png',
      name: "Activity name " + (j + 1),
      description:
        "Description of item A Description of item B i i i i i i i Description of item Description of item Description of item " +
        j,
      isTimerSet: true,
      status: ActivityStatus.Scheduled,
      availableFrom: new Date(),
      availableTo: new Date(),
      scheduledAt: null,
      timeLeftToComplete: null,
      showAllAtOnce: false,
      splashScreen: "",
      isReviewable: false,
      isSkippable: false,
      responseIsEditable: false,
      ordering: j,
      items: [],
    })
  }
}
export default groupMocks