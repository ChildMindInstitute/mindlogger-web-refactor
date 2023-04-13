import { z } from "zod"

import { Dictionary } from "~/shared/utils"

export const RecoveryPasswordSchema = z
  .object({
    new: z.string().trim().min(6, { message: Dictionary.validation.password.minLength }),
    confirm: z.string().trim().min(6, { message: Dictionary.validation.password.minLength }),
  })
  .refine(data => data.new === data.confirm, {
    message: Dictionary.validation.password.notMatch,
    path: ["confirm"],
  })

export type RecoveryPassword = z.infer<typeof RecoveryPasswordSchema>
