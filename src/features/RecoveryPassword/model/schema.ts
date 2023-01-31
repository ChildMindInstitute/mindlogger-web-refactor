import { z } from "zod"

import { Dictionary } from "~/shared/utils"

export const RecoveryPasswordSchema = z
  .object({
    new: z.string().min(6, { message: Dictionary.validation.password.required }),
    confirm: z.string().min(6, { message: Dictionary.validation.password.required }),
  })
  .refine(data => data.new === data.confirm, {
    message: Dictionary.validation.password.notMatch,
    path: ["confirmNewPassword"],
  })

export type RecoveryPassword = z.infer<typeof RecoveryPasswordSchema>
