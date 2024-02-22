import { z } from 'zod';

export const TokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
});

export type Tokens = z.infer<typeof TokensSchema>;
