import { z } from "zod"

import { BaseUserSchema } from "~/entities/user"

export type TSignupForm = z.infer<typeof SignupFormSchema>

export const SignupFormSchema = BaseUserSchema.pick({ email: true, lastName: true, firstName: true })
  .extend({
    firstName: z.string().min(1, "SignUp.firstNameRequiredError"),
    lastName: z.string().min(1, "SignUp.lastNameRequiredError"),
    password: z.string().min(1, "SignUp.passwordErrorMessage"),
    confirmPassword: z.string().min(1, "SignUp.passwordErrorMessage"),
  })
  .refine(data => data.confirmPassword === data.password, {
    message: "SignUp.passwordsUnmatched",
    path: ["confirmPassword"],
  })
