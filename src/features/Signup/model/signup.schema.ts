import { z } from 'zod';

import { BaseUserSchema } from '~/entities/user';
import { ACCOUNT_PASSWORD_MIN_LENGTH } from '~/shared/constants';
import { Dictionary } from '~/shared/utils';
import { checkPassword } from '~/shared/utils/passwordValidation';

export type TSignupForm = z.infer<typeof SignupFormSchema>;

export const SignupFormSchema = BaseUserSchema.pick({
  email: true,
  lastName: true,
  firstName: true,
})
  .extend({
    firstName: z.string().trim().min(1, Dictionary.validation.firstName.required),
    lastName: z.string().trim().min(1, Dictionary.validation.lastName.required),
    password: z
      .string()
      .trim()
      .min(ACCOUNT_PASSWORD_MIN_LENGTH, Dictionary.validation.password.minLength)
      .refine((value) => checkPassword(value).hasNoSpaces, {
        message: Dictionary.validation.password.blankSpaces,
      })
      .refine((value) => checkPassword(value).meetsCharTypeRequirement, {
        message: Dictionary.validation.password.characterTypes,
      }),
    confirmPassword: z.string().trim().min(1, Dictionary.validation.password.required),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: Dictionary.validation.password.notMatch,
    path: ['confirmPassword'],
  });
