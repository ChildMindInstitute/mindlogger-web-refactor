import { parseDateToMidnightUTC } from './parseDateToMidnightUTC';

describe('parseDateToMidnightUTC', () => {
  it('should return a Date object for a valid date string', () => {
    const dateStr = '2025-01-01';
    const result = parseDateToMidnightUTC(dateStr);
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe('2025-01-01T00:00:00.000Z');
  });

  test('should throw error for invalid formats', () => {
    expect(() => parseDateToMidnightUTC('2025/01/01')).toThrow(
      '[parseDateToMidnightUTC] Invalid date string format',
    );
    expect(() => parseDateToMidnightUTC('2025-01')).toThrow(
      '[parseDateToMidnightUTC] Invalid date string format',
    );
    expect(() => parseDateToMidnightUTC('invalid-date')).toThrow(
      '[parseDateToMidnightUTC] Invalid date string format',
    );
    expect(() => parseDateToMidnightUTC('')).toThrow(
      '[parseDateToMidnightUTC] Invalid date string format',
    );
  });

  it('should handle timezone inconsistencies correctly', () => {
    const dateStr = '2024-06-15';
    const result = parseDateToMidnightUTC(dateStr);
    expect(result.getUTCDate()).toBe(15);
    expect(result.getUTCMonth()).toBe(5);
    expect(result.getUTCFullYear()).toBe(2024);
  });
});
