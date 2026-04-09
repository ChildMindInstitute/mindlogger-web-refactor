import { z } from 'zod';

import { BaseUserSchema } from '~/entities/user';
import { LEGACY_PASSWORD_MIN_LENGTH } from '~/shared/constants';
import { Dictionary } from '~/shared/utils';

export const LoginSchema = BaseUserSchema.pick({ email: true }).extend({
  password: z.string().min(LEGACY_PASSWORD_MIN_LENGTH, Dictionary.validation.password.minLength),
});
export type TLoginForm = z.infer<typeof LoginSchema>;
