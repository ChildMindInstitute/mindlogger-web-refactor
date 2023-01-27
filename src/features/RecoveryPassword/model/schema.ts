import { z } from "zod"

export const RecoveryPasswordSchema = z
  .object({
    new: z.string(),
    confirm: z.string(),
  })
  .refine(data => data.new === data.confirm, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })

export type RecoveryPassword = z.infer<typeof RecoveryPasswordSchema>
