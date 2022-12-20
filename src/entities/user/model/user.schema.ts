import { z } from "zod"

// User
export const UserSchema = z.object({
  email: z.string({ required_error: "Email required" }).email("Please enter valid email"),
  emailVerified: z.boolean(),
  admin: z.boolean(),
  lastName: z.string(),
  firstName: z.string(),
  displayName: z.string(),
  creatorId: z.string(),
  created: z.string(),
  login: z.string(),
  otp: z.boolean(),
  public: z.boolean(),
  size: z.number(),
  status: z.string(),
  _accessLevel: z.number(),
  _id: z.string(),
  _modelType: z.string(),
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
    token: z.string(),
    expires: z.string(),
    scope: z.string().array(),
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
