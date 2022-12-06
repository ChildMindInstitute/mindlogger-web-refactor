import * as z from "zod"
import { UserSchema } from "~/entities/"

export const LoginSchema = UserSchema.pick({ email: true })
  .extend({
    password: z.string().min(1, "Password required"),
  })
  .required()
