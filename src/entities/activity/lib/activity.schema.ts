import { z } from "zod"

export const ActivityStatusSchema = z
  .literal("NotDefined")
  .or(z.literal("InProgress"))
  .or(z.literal("Scheduled"))
  .or(z.literal("PastDue"))

export const ActivityGroupTypeSchema = z.object({
  NotDefined: z.literal("NotDefined"),
  InProgress: z.literal("InProgress"),
  Scheduled: z.literal("Scheduled"),
  Available: z.literal("Available"),
})

export const ActivitySchema = z.object({
  id: z.string().or(z.number()),
  guid: z.string(),
  name: z.string(),
  description: z.object({
    en: z.string(),
    fr: z.string(),
  }),
  splashScreen: z.string(),
  image: z.string(),
  showAllAtOnce: z.boolean(),
  isSkippable: z.boolean(),
  isReviewable: z.boolean(),
  responseIsEditable: z.boolean(),
  ordering: z.number(),
  items: z.array(z.string()),
})

export const ActivityItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.object({
    en: z.string(),
    fr: z.string(),
  }),
  image: z.string().nullable(),

  isInActivityFlow: z.boolean(),
  activityFlowName: z.string().nullable(),
  numberOfActivitiesInFlow: z.number().nullable(),
  activityPositionInFlow: z.number().nullable(),

  status: ActivityStatusSchema,

  isTimeoutAccess: z.boolean(), // todo - rename
  isTimeoutAllow: z.boolean(), // todo - rename
  isTimedActivityAllow: z.boolean(), // todo - rename
  hasEventContext: z.boolean(),

  scheduledAt: z.string().nullable(),
  availableFrom: z.string().nullable(),
  availableTo: z.string().nullable(), // specific date or to "Midnight"

  timeToComplete: z.object({ hours: z.number(), minutes: z.number() }).nullable(),
})

export type ActivityStatus = z.infer<typeof ActivityStatusSchema>
export type ActivityGroupStatus = z.infer<typeof ActivityGroupTypeSchema>
export type Activity = z.infer<typeof ActivityItemSchema>
