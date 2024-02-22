import { z } from 'zod';

import { BaseUserSchema } from '~/entities/user';
import { Dictionary } from '~/shared/utils';

export type TSignupForm = z.infer<typeof SignupFormSchema>;

export const SignupFormSchema = BaseUserSchema.pick({
  email: true,
  lastName: true,
  firstName: true,
})
  .extend({
    firstName: z.string().trim().min(1, Dictionary.validation.firstName.required),
    lastName: z.string().trim().min(1, Dictionary.validation.lastName.required),
    password: z.string().trim().min(6, Dictionary.validation.password.minLength),
    confirmPassword: z.string().trim().min(6, Dictionary.validation.password.minLength),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: Dictionary.validation.password.notMatch,
    path: ['confirmPassword'],
  });
