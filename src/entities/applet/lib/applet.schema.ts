import { z } from "zod"

export const AppletSchema = z.object({
  id: z.number().or(z.string()),
  displayName: z.string(),
  version: z.string(),
  description: z.object({
    en: z.string(),
    fr: z.string(),
  }),
  about: z.object({
    en: z.string(),
    fr: z.string(),
  }),
  image: z.string(),
  watermark: z.string(),
  themeId: z.string().or(z.number()).nullable(),
  reportServerIp: z.string(),
  reportPublicKey: z.string(),
  reportRecipients: z.array(z.string()),
  reportIncludeUserId: z.boolean(),
  reportIncludeCaseId: z.boolean(),
  reportEmailBody: z.string(),
  activities: z.array(z.string()),
  activityFlows: z.array(z.string()),
})

export type Applet = z.infer<typeof AppletSchema>
