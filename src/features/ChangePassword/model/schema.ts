import i18n from 'i18next';
import { z } from 'zod';

import {
  ACCOUNT_PASSWORD_MIN_LENGTH,
  ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
  LEGACY_PASSWORD_MIN_LENGTH,
} from '~/shared/constants';
import { checkPassword } from '~/shared/utils/passwordValidation';

export const ChangePasswordSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('validation.passwordRequired');
  const oldPasswordMinLength = t('validation.passwordMinLength', {
    chars: LEGACY_PASSWORD_MIN_LENGTH,
  });
  const passwordMinLength = t('validation.passwordMinLength', {
    chars: ACCOUNT_PASSWORD_MIN_LENGTH,
  });
  const passwordBlankSpaces = t('validation.passwordBlankSpaces');
  const passwordCharacterTypes = t('validation.passwordCharacterTypes', {
    types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
  });
  const passwordsNotMatch = t('validation.passwordsUnmatched');

  return z
    .object({
      old: z
        .string()
        .trim()
        .refine((value) => checkPassword(value, LEGACY_PASSWORD_MIN_LENGTH).meetsLength, {
          message: oldPasswordMinLength,
        }),
      new: z
        .string()
        .trim()
        .refine((value) => checkPassword(value).meetsLength, {
          message: passwordMinLength,
        })
        .refine((value) => checkPassword(value).hasNoSpaces, {
          message: passwordBlankSpaces,
        })
        .refine((value) => checkPassword(value).meetsCharTypeRequirement, {
          message: passwordCharacterTypes,
        }),
      confirm: z.string().trim().min(1, { message: passwordRequired }),
    })
    .refine((data) => data.new === data.confirm, {
      message: passwordsNotMatch,
      path: ['confirm'],
    });
};

export type TChangePassword = z.infer<ReturnType<typeof ChangePasswordSchema>>;
