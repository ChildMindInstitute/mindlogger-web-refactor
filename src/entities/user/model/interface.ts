import * as z from "zod"
import { AuthSchema, UserSchema, UserStateSchema } from "./user.schema"

export type User = z.infer<typeof UserSchema>
export type TUserStateSchema = z.infer<typeof UserStateSchema>

export type Authorization = z.infer<typeof AuthSchema>
