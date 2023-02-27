import { z } from "zod"

const ActivitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string().optional(),
  isReviewable: z.boolean(),
  isSkippable: z.boolean(),
  ordering: z.number(),
  splashScreen: z.string().optional(),
})

const ActivityFlowSchema = z.object({
  id: z.string(),
  guid: z.string(),
  name: z.string(),
  description: z.string(),
  isSingleReport: z.boolean(),
  hideBadge: z.boolean(),
  ordering: z.number(),
  activityIds: z.array(z.string()),
})

export const AppletBaseSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  description: z.string(),
  about: z.string(),
  image: z.string().optional(),
  watermark: z.string().optional(),
})

export const AppletDetailsSchema = AppletBaseSchema.extend({
  activities: z.array(ActivitySchema),
  activityFlows: z.array(ActivityFlowSchema),
})

export type AppletBase = z.infer<typeof AppletBaseSchema>
export type AppletDetails = z.infer<typeof AppletDetailsSchema>
