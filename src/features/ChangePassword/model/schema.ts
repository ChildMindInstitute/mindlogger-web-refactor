import { z } from "zod"

export const ChangePasswordSchema = z
  .object({
    old: z.string().min(6, { message: "SignUp.passwordErrorMessage" }),
    new: z.string().min(6, { message: "SignUp.passwordErrorMessage" }),
    confirm: z.string().min(6, { message: "SignUp.passwordErrorMessage" }),
  })
  .refine(data => data.new === data.confirm, {
    message: "SignUp.passwordsUnmatched",
    path: ["confirmNewPassword"],
  })

export type TChangePassword = z.infer<typeof ChangePasswordSchema>
