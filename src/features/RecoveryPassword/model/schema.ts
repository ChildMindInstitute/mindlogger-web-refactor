import { z } from "zod"

export const RecoveryPasswordSchema = z
  .object({
    new: z.string().min(6, { message: "SignUp.passwordErrorMessage" }),
    confirm: z.string().min(6, { message: "SignUp.passwordErrorMessage" }),
  })
  .refine(data => data.new === data.confirm, {
    message: "SignUp.passwordsUnmatched",
    path: ["confirmNewPassword"],
  })

export type RecoveryPassword = z.infer<typeof RecoveryPasswordSchema>
