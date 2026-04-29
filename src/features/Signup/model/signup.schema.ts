import { z } from 'zod';

import { BaseUserSchema } from '~/entities/user';
import { ACCOUNT_PASSWORD_MIN_LENGTH, ACCOUNT_PASSWORD_MIN_CHAR_TYPES } from '~/shared/constants';
import { Dictionary } from '~/shared/utils';
import { checkPassword } from '~/shared/utils/passwordValidation';

export const SignupFormSchema = BaseUserSchema.pick({
  email: true,
  lastName: true,
  firstName: true,
})
  .extend({
    firstName: z.string().trim().min(1, Dictionary.validation.firstName.required),
    lastName: z.string().trim().min(1, Dictionary.validation.lastName.required),
    password: z.string().superRefine((value, ctx) => {
      const result = checkPassword(value);
      if (!result.meetsLength)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: Dictionary.validation.password.minLength,
          params: { chars: ACCOUNT_PASSWORD_MIN_LENGTH },
        });
      if (!result.hasNoSpaces)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: Dictionary.validation.password.blankSpaces,
        });
      if (!result.hasNoEmoji)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: Dictionary.validation.password.cannotContainEmojis,
        });
      if (!result.meetsCharTypeRequirement)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: Dictionary.validation.password.characterTypes,
          params: { types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES },
        });
    }),
    confirmPassword: z.string().min(1, Dictionary.validation.password.required),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: Dictionary.validation.password.notMatch,
    path: ['confirmPassword'],
  });

export type TSignupForm = z.infer<typeof SignupFormSchema>;
