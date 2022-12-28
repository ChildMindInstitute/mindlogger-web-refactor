import { z } from "zod"

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().optional(),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "",
    path: ["confirmNewPassword"],
  })

export type TChangePassword = z.infer<typeof ChangePasswordSchema>
