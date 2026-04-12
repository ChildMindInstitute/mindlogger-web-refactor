import { z } from 'zod';

import { ACCOUNT_PASSWORD_MIN_LENGTH, ACCOUNT_PASSWORD_MIN_CHAR_TYPES } from '~/shared/constants';
import { Dictionary } from '~/shared/utils';
import { checkPassword } from '~/shared/utils/passwordValidation';

export const ChangePasswordSchema = z
  .object({
    old: z.string().min(1, { message: Dictionary.validation.password.required }),
    new: z.string().superRefine((value, ctx) => {
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
      if (!result.meetsCharTypeRequirement)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: Dictionary.validation.password.characterTypes,
          params: { types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES },
        });
    }),
    confirm: z.string().min(1, { message: Dictionary.validation.password.required }),
  })
  .refine((data) => data.new === data.confirm, {
    message: Dictionary.validation.password.notMatch,
    path: ['confirm'],
  });

export type TChangePassword = z.infer<typeof ChangePasswordSchema>;
