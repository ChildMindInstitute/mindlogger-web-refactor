import i18n from 'i18next';
import { z } from 'zod';

import { BaseUserSchema } from '~/entities/user';
import { ACCOUNT_PASSWORD_MIN_LENGTH, ACCOUNT_PASSWORD_MIN_CHAR_TYPES } from '~/shared/constants';
import { checkPassword } from '~/shared/utils/passwordValidation';

export const SignupFormSchema = () => {
  const { t } = i18n;
  const firstNameRequired = t('validation.firstNameRequired');
  const lastNameRequired = t('validation.lastNameRequired');
  const passwordRequired = t('validation.passwordRequired');
  const passwordMinLength = t('validation.passwordMinLength', {
    chars: ACCOUNT_PASSWORD_MIN_LENGTH,
  });
  const passwordBlankSpaces = t('validation.passwordBlankSpaces');
  const passwordCharacterTypes = t('validation.passwordCharacterTypes', {
    types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES,
  });
  const passwordsNotMatch = t('validation.passwordsUnmatched');

  return BaseUserSchema.pick({
    email: true,
    lastName: true,
    firstName: true,
  })
    .extend({
      firstName: z.string().trim().min(1, firstNameRequired),
      lastName: z.string().trim().min(1, lastNameRequired),
      password: z.string().superRefine((value, ctx) => {
        const result = checkPassword(value);
        if (!result.meetsLength)
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: passwordMinLength });
        if (!result.hasNoSpaces)
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: passwordBlankSpaces });
        if (!result.meetsCharTypeRequirement)
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: passwordCharacterTypes });
      }),
      confirmPassword: z.string().min(1, passwordRequired),
    })
    .refine((data) => data.confirmPassword === data.password, {
      message: passwordsNotMatch,
      path: ['confirmPassword'],
    });
};

export type TSignupForm = z.infer<ReturnType<typeof SignupFormSchema>>;
