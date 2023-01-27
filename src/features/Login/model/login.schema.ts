import { z } from "zod"

import { BaseUserSchema } from "~/entities/user"

export const LoginSchema = BaseUserSchema.pick({ email: true }).extend({
  password: z.string().min(1, "Login.passwordErrorMessage"),
})
export type TLoginForm = z.infer<typeof LoginSchema>
