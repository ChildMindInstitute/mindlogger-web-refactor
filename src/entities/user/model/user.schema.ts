import { z } from "zod"

// User
export const UserSchema = z.object({
  email: z.string({ required_error: "Email required" }).email("Please enter valid email"),
  id: z.string().or(z.number()),
  fullName: z.string(),
})
export type User = z.infer<typeof UserSchema>

// Redux state User
export const UserStoreSchema = UserSchema.omit({ email: true })
  .extend({
    email: z.string(),
  })
  .partial()
export type UserStore = z.infer<typeof UserStoreSchema>

// Authorization
export const AuthSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string(),
    tokenType: z.string(),
  })
  .partial()
export type Authorization = z.infer<typeof AuthSchema>

// Account
export const UserAccountSchema = z.object({
  accountId: z.string(),
  accountName: z.string(),
  applets: z.unknown(),
  isDefaultName: z.boolean(),
})
export type Account = z.infer<typeof UserAccountSchema>
