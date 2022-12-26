import { z } from "zod"

export const ForgotPasswordSchema = z.object({
  email: z.string(),
})
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>
