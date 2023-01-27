import { z } from "zod"

export const ChangePasswordSchema = z
  .object({
    old: z.string(),
    new: z.string(),
    confirm: z.string(),
  })
  .refine(data => data.new === data.confirm, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })

export type TChangePassword = z.infer<typeof ChangePasswordSchema>
