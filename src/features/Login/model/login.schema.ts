import i18n from 'i18next';
import { z } from 'zod';

import { BaseUserSchema } from '~/entities/user';
import { LEGACY_PASSWORD_MIN_LENGTH } from '~/shared/constants';
import { checkPassword } from '~/shared/utils/passwordValidation';

export const LoginSchema = () => {
  const { t } = i18n;
  const passwordMinLength = t('validation.passwordMinLength', {
    chars: LEGACY_PASSWORD_MIN_LENGTH,
  });

  return BaseUserSchema.pick({ email: true }).extend({
    password: z
      .string()
      .refine((value) => checkPassword(value, LEGACY_PASSWORD_MIN_LENGTH).meetsLength, {
        message: passwordMinLength,
      }),
  });
};

export type TLoginForm = z.infer<ReturnType<typeof LoginSchema>>;
