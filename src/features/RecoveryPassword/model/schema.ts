import { z } from 'zod';

import { ACCOUNT_PASSWORD_MIN_LENGTH } from '~/shared/constants';
import { Dictionary } from '~/shared/utils';
import { checkPassword } from '~/shared/utils/passwordValidation';

export const RecoveryPasswordSchema = z
  .object({
    new: z
      .string()
      .trim()
      .min(ACCOUNT_PASSWORD_MIN_LENGTH, { message: Dictionary.validation.password.minLength })
      .refine((value) => checkPassword(value).hasNoSpaces, {
        message: Dictionary.validation.password.blankSpaces,
      })
      .refine((value) => checkPassword(value).meetsCharTypeRequirement, {
        message: Dictionary.validation.password.characterTypes,
      }),
    confirm: z.string().trim().min(1, { message: Dictionary.validation.password.required }),
  })
  .refine((data) => data.new === data.confirm, {
    message: Dictionary.validation.password.notMatch,
    path: ['confirm'],
  });

export type RecoveryPassword = z.infer<typeof RecoveryPasswordSchema>;
