import { timeToHourMinute } from './toHourMinute';

describe('timeToHourMinute', () => {
  test('should correctly parse valid time string', () => {
    expect(timeToHourMinute('12:34')).toEqual({ hours: 12, minutes: 34 });
    expect(timeToHourMinute('00:00')).toEqual({ hours: 0, minutes: 0 });
  });

  test('should throw error for invalid formats', () => {
    expect(() => timeToHourMinute('1234')).toThrow('[timeToHourMinute] Invalid time string format');
    expect(() => timeToHourMinute('12:345')).toThrow(
      '[timeToHourMinute] Invalid time string format',
    );
    expect(() => timeToHourMinute('')).toThrow('[timeToHourMinute] Invalid time string format');
  });
});
