import {
  DEFAULT_IDLE_TIMEOUT_MIN,
  DEFAULT_REFRESH_LEAD_SEC,
  MS_IN_MIN,
  MS_IN_SEC,
} from './session.const';
import { SessionConfig } from './session.types';

// A non-positive value would put every deadline in the past.
const positiveOrDefault = (raw: string | undefined, fallback: number) => {
  const parsed = Number(raw);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const resolveSessionConfig = (
  env: Partial<ImportMetaEnv> = import.meta.env,
): SessionConfig => ({
  idleTimeoutMs: positiveOrDefault(env.VITE_IDLE_TIMEOUT_MIN, DEFAULT_IDLE_TIMEOUT_MIN) * MS_IN_MIN,
  refreshLeadMs: positiveOrDefault(env.VITE_REFRESH_LEAD_SEC, DEFAULT_REFRESH_LEAD_SEC) * MS_IN_SEC,
});
