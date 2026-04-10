import i18n from 'i18next';
import { z } from 'zod';

import { BaseUserSchema } from '~/entities/user';

export const LoginSchema = () => {
  const { t } = i18n;
  const passwordRequired = t('validation.passwordRequired');

  return BaseUserSchema.pick({ email: true }).extend({
    password: z.string().min(1, passwordRequired),
  });
};

export type TLoginForm = z.infer<ReturnType<typeof LoginSchema>>;
