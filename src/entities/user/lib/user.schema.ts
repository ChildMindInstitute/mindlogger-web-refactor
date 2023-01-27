import { z } from "zod"

// User
export const BaseUserSchema = z.object({
  email: z.string({ required_error: "Email required" }).email("Please enter valid email"),
  id: z.string().or(z.number()),
  fullName: z.string(),
})

export type User = z.infer<typeof BaseUserSchema>
