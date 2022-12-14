import { z } from "zod"

export const UserSchema = z.object({
  email: z.string({ required_error: "Email required" }).email("Please enter valid email"),
  emailVerified: z.boolean(),
  admin: z.boolean(),
  lastName: z.string(),
  firstName: z.string(),
  displayName: z.string(),
  creatorId: z.string(),
  created: z.string(),
})

export const UserStateSchema = UserSchema.omit({ email: true })
  .extend({
    email: z.string(),
  })
  .partial()

export const AuthSchema = z
  .object({
    token: z.string(),
    expires: z.string(),
    scope: z.string().array(),
  })
  .partial()
