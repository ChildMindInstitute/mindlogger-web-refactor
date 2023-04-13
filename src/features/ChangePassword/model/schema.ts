import { z } from "zod"

import { Dictionary } from "~/shared/utils"

export const ChangePasswordSchema = z
  .object({
    old: z.string().trim().min(6, { message: Dictionary.validation.password.minLength }),
    new: z.string().trim().min(6, { message: Dictionary.validation.password.minLength }),
    confirm: z.string().trim().min(6, { message: Dictionary.validation.password.minLength }),
  })
  .refine(data => data.new === data.confirm, {
    message: Dictionary.validation.password.notMatch,
    path: ["confirm"],
  })

export type TChangePassword = z.infer<typeof ChangePasswordSchema>
