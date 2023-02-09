export const activityMock = {
  id: 8,
  name: "Mock acitivity name",
  description: {
    en: "English description of mock acitvity",
    fr: "French description of mock acitvity",
  },
  image: "",

  isInActivityFlow: false,
  activityFlowName: "",
  numberOfActivitiesInFlow: null,
  activityPositionInFlow: null,

  status: "InProgress",

  isTimeoutAccess: false,
  isTimeoutAllow: false,
  isTimedActivityAllow: false,
  hasEventContext: false,

  scheduledAt: null,
  availableFrom: null,
  availableTo: null,

  timeToComplete: { hours: 15, minutes: 0 },
}
