import { resolveSessionConfig } from './sessionConfig';

describe('resolveSessionConfig', () => {
  it('falls back to 30 minutes idle and 90 seconds of refresh lead', () => {
    expect(resolveSessionConfig({})).toEqual({ idleTimeoutMs: 1800000, refreshLeadMs: 90000 });
  });

  it('converts the env values from minutes and seconds to milliseconds', () => {
    const config = resolveSessionConfig({
      VITE_IDLE_TIMEOUT_MIN: '3',
      VITE_REFRESH_LEAD_SEC: '20',
    });

    expect(config).toEqual({ idleTimeoutMs: 180000, refreshLeadMs: 20000 });
  });

  it.each(['0', '-5', 'soon', ''])(
    'ignores %s, which would put every deadline in the past',
    (raw) => {
      const config = resolveSessionConfig({
        VITE_IDLE_TIMEOUT_MIN: raw,
        VITE_REFRESH_LEAD_SEC: raw,
      });

      expect(config).toEqual({ idleTimeoutMs: 1800000, refreshLeadMs: 90000 });
    },
  );
});
