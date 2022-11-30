import { string } from "yup"

import { UserSchema } from "~/entities/user/model/user.schema"

export const LoginSchema = UserSchema.pick(["email"]).shape({
  password: string().required("Please Enter your password"),
})
