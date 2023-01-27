import { z } from "zod"

import { Dictionary } from "~/shared/utils"

export const ChangePasswordSchema = z
  .object({
    old: z.string().min(6, { message: Dictionary.validation.password.required }),
    new: z.string().min(6, { message: Dictionary.validation.password.required }),
    confirm: z.string().min(6, { message: Dictionary.validation.password.required }),
  })
  .refine(data => data.new === data.confirm, {
    message: Dictionary.validation.password.notMatch,
    path: ["confirmNewPassword"],
  })

export type TChangePassword = z.infer<typeof ChangePasswordSchema>
