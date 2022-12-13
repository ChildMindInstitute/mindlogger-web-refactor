import * as z from "zod"
import { AuthSchema, UserSchema, UserStateSchema } from "./user.schema"

export type TUserSchema = z.infer<typeof UserSchema>
export type TUserStateSchema = z.infer<typeof UserStateSchema>

export type TUserAuthSchema = z.infer<typeof AuthSchema>
