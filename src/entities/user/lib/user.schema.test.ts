import { BaseUserSchema } from './user.schema';

import { Dictionary } from '~/shared/utils';

const EmailSchema = BaseUserSchema.pick({ email: true });

describe('BaseUserSchema email', () => {
  test.each(['first.last+tag@sub.example.org', "o'brien@example.com", 'UPPER@EXAMPLE.COM'])(
    'accepts %s',
    (email) => {
      expect(EmailSchema.safeParse({ email }).success).toBe(true);
    },
  );

  test.each(['', 'a..b@x.com', '.a@x.com', 'a@x.c'])('rejects "%s" as invalid', (email) => {
    const result = EmailSchema.safeParse({ email });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(Dictionary.validation.email.invalid);
  });
});
