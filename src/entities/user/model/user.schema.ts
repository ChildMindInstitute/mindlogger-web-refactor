import * as z from "zod"

export const UserSchema = z.object({
  username: z.string(),
  email: z.string({ required_error: "Email required" }).email("Please enter valid email"),
})
