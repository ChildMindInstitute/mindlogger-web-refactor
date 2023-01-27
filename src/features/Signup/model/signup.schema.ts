import { z } from "zod"

import { BaseUserSchema } from "~/entities/user"

export type TSignupForm = z.infer<typeof SignupFormSchema>

export const SignupFormSchema = BaseUserSchema.pick({ email: true, lastName: true, firstName: true })
  .extend({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    password: z.string().min(1, "Password required"),
    confirmPassword: z.string().min(1, "Password confirmation required"),
  })
  .refine(data => data.confirmPassword === data.password, {
    message: "Passwords Do Not Match",
    path: ["confirmPassword"],
  })
