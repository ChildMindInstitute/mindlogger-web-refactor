import { z } from 'zod';

import { BaseUserSchema } from '~/entities/user';
import { Dictionary } from '~/shared/utils';

export const LoginSchema = BaseUserSchema.pick({ email: true }).extend({
  password: z.string().min(1, Dictionary.validation.password.required),
});
export type TLoginForm = z.infer<typeof LoginSchema>;
