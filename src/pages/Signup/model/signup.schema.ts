import { z } from "zod"
import { UserSchema } from "~/entities"

export type TSignupForm = z.infer<typeof SignupFormSchema>

export const SignupFormSchema = UserSchema.pick({ email: true, lastName: true, firstName: true }).extend({
  password: z.string().min(1, "Password required"),
  confirmPassword: z.string().min(1, "Password required"),
})
