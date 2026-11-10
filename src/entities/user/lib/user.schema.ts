import { z } from 'zod';

import { Dictionary } from '~/shared/utils';

// User
export const BaseUserSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? Dictionary.validation.email.required
        : Dictionary.validation.email.invalid,
  }),
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export type User = z.infer<typeof BaseUserSchema>;
