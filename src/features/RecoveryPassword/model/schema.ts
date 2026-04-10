import i18n from 'i18next';
import { z } from 'zod';

import { ACCOUNT_PASSWORD_MIN_LENGTH, ACCOUNT_PASSWORD_MIN_CHAR_TYPES } from '~/shared/constants';
import { checkPassword } from '~/shared/utils/passwordValidation';

export const RecoveryPasswordSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('validation.passwordRequired');
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
      new: z.string().superRefine((value, ctx) => {
        const result = checkPassword(value);
        if (!result.meetsLength)
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: passwordMinLength });
        if (!result.hasNoSpaces)
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: passwordBlankSpaces });
        if (!result.meetsCharTypeRequirement)
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: passwordCharacterTypes });
      }),
      confirm: z.string().min(1, { message: passwordRequired }),
    })
    .refine((data) => data.new === data.confirm, {
      message: passwordsNotMatch,
      path: ['confirm'],
    });
};

export type RecoveryPassword = z.infer<ReturnType<typeof RecoveryPasswordSchema>>;
