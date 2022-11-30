import { InferType } from "yup"

import { LoginSchema } from "./login.schema"

export type TLoginForm = InferType<typeof LoginSchema>
