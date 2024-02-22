import { z } from "zod"

import { BaseUserSchema } from "~/entities/user"

export const ForgotPasswordSchema = BaseUserSchema.pick({ email: true })
export type TForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>
