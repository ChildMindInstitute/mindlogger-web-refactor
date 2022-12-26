import { UserSchema } from "~/entities"
import { z } from "zod"

export const ForgotPasswordSchema = UserSchema.pick({ email: true })
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>
