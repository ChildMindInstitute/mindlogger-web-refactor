import { resolveSessionConfig } from './sessionConfig';

describe('resolveSessionConfig', () => {
  it('falls back to the built-in defaults, shortened on this test branch', () => {
    expect(resolveSessionConfig({})).toEqual({
      idleTimeoutMs: 180000,
      refreshLeadMs: 90000,
      warningLeadMs: 60000,
    });
  });

  it('converts the env values from minutes and seconds to milliseconds', () => {
    const config = resolveSessionConfig({
      VITE_IDLE_TIMEOUT_MIN: '3',
      VITE_REFRESH_LEAD_SEC: '20',
      VITE_IDLE_WARNING_MIN: '1',
    });

    expect(config).toEqual({ idleTimeoutMs: 180000, refreshLeadMs: 20000, warningLeadMs: 60000 });
  });

  it.each(['0', '-5', 'soon', ''])(
    'ignores %s, which would put every deadline in the past',
    (raw) => {
      const config = resolveSessionConfig({
        VITE_IDLE_TIMEOUT_MIN: raw,
        VITE_REFRESH_LEAD_SEC: raw,
        VITE_IDLE_WARNING_MIN: raw,
      });

      expect(config).toEqual({
        idleTimeoutMs: 180000,
        refreshLeadMs: 90000,
        warningLeadMs: 60000,
      });
    },
  );

  // Both values passed explicitly rather than leaning on the default, so shortening the default
  // for a test build cannot quietly stop this from exercising the cap.
  it('caps the warning at half the idle timeout', () => {
    const config = resolveSessionConfig({
      VITE_IDLE_TIMEOUT_MIN: '3',
      VITE_IDLE_WARNING_MIN: '5',
    });

    expect(config.warningLeadMs).toBe(90000);
  });

  it('leaves a warning shorter than half the timeout alone', () => {
    const config = resolveSessionConfig({
      VITE_IDLE_TIMEOUT_MIN: '30',
      VITE_IDLE_WARNING_MIN: '5',
    });

    expect(config.warningLeadMs).toBe(300000);
  });
});
