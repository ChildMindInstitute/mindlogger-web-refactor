import { string } from "yup"

import { UserSchema } from "~/entities/"

export const LoginSchema = UserSchema.pick(["email"]).shape({
  password: string().required("Please Enter your password"),
})
