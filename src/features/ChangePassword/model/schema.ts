import { z } from "zod"

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().optional(),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Password do not match",
    path: ["confirmNewPassword"],
  })
  .transform(data => ({ old: data.oldPassword, new: data.newPassword, confirm: data.confirmNewPassword }))

export type TChangePassword = z.infer<typeof ChangePasswordSchema>
