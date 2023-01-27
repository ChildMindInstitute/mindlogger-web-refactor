import { z } from "zod"

import { BaseUserSchema } from "~/entities/user"
import { Dictionary } from "~/shared/utils"

export type TSignupForm = z.infer<typeof SignupFormSchema>

export const SignupFormSchema = BaseUserSchema.pick({ email: true, lastName: true, firstName: true })
  .extend({
    firstName: z.string().min(1, Dictionary.validation.firstName.required),
    lastName: z.string().min(1, Dictionary.validation.lastName.required),
    password: z.string().min(1, Dictionary.validation.password.required),
    confirmPassword: z.string().min(1, Dictionary.validation.password.required),
  })
  .refine(data => data.confirmPassword === data.password, {
    message: Dictionary.validation.password.notMatch,
    path: ["confirmPassword"],
  })
