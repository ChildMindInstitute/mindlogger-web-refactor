import { z } from "zod"

export const RecoveryPasswordSchema = z
  .object({
    newPassword: z.string(),
    confirmNewPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .transform(data => ({ new: data.newPassword, confirm: data.confirmNewPassword }))

export type RecoveryPassword = z.infer<typeof RecoveryPasswordSchema>
