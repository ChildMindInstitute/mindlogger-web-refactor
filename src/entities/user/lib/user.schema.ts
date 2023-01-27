import { z } from "zod"

import { Dictionary } from "~/shared/utils"

// User
export const BaseUserSchema = z.object({
  email: z.string({ required_error: Dictionary.validation.email.required }).email(Dictionary.validation.email.invalid),
  id: z.string().or(z.number()),
  fullName: z.string(),
})

export type User = z.infer<typeof BaseUserSchema>
