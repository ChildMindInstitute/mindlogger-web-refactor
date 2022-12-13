import * as z from "zod"
import { DateSchema } from "~/utils/validation/date.schema"

export const UserSchema = z.object({
  email: z.string({ required_error: "Email required" }).email("Please enter valid email"),
  emailVerified: z.boolean(),
  admin: z.boolean(),
  lastName: z.string(),
  firstName: z.string(),
  displayName: z.string(),
  creatorId: z.string(),
  created: DateSchema,
})
