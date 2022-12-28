import { z } from "zod"

import { UserSchema } from "~/entities"

export const ForgotPasswordSchema = UserSchema.pick({ email: true })
export type TForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>
