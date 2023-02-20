import { z } from "zod"

const ActivitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string().nullable(),
  isReviewable: z.boolean(),
  isSkippable: z.boolean(),
  ordering: z.boolean(),
  splashScreen: z.string(),
})

const ActivityFlowSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  description: z.string(),
  hideBadge: z.boolean(),
  isSingleReport: z.boolean(),
  ordering: z.boolean(),
  items: z.array(z.object({ activityId: z.string() })),
})

export const AppletSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  image: z.string(),
  displayName: z.string(),
  description: z.string(),
  activities: z.array(ActivitySchema),
  activityFlows: z.array(ActivityFlowSchema),
})

export type Applet = z.infer<typeof AppletSchema>
