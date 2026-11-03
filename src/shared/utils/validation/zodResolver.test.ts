import type { ResolverOptions } from 'react-hook-form';
import { z } from 'zod';

import zodResolver from './zodResolver';

const schema = z
  .object({
    password: z.string().superRefine((value, ctx) => {
      if (value.length < 10)
        ctx.addIssue({ code: 'custom', message: 'password.minLength', params: { chars: 10 } });
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: 'password.notMatch',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

const options = { fields: {}, shouldUseNativeValidation: false } as ResolverOptions<FormValues>;

describe('zodResolver', () => {
  test('maps a custom issue to a field error and keeps its params', async () => {
    const { errors } = await zodResolver(schema)<FormValues, undefined>(
      { password: 'short', confirmPassword: 'short' },
      undefined,
      options,
    );

    expect(errors).toMatchObject({
      password: { message: 'password.minLength', type: 'custom', params: { chars: 10 } },
    });
  });

  test('maps a refine error to its path', async () => {
    const { errors } = await zodResolver(schema)<FormValues, undefined>(
      { password: 'long-enough-1', confirmPassword: 'different-1' },
      undefined,
      options,
    );

    expect(errors).toMatchObject({ confirmPassword: { message: 'password.notMatch' } });
  });
});
