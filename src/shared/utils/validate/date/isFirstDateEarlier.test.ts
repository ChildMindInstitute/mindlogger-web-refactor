import { isFirstDateEarlier } from './isFirstDateEarlier';

describe('isFirstDateEarlier', () => {
  test('returns true if the first date is earlier than the second date', () => {
    const date1 = new Date('2024-08-08');
    const date2 = new Date('2024-08-09');
    expect(isFirstDateEarlier(date1, date2)).toBe(true);
  });

  test('returns false if the first date is later than the second date', () => {
    const date1 = new Date('2024-08-10');
    const date2 = new Date('2024-08-09');
    expect(isFirstDateEarlier(date1, date2)).toBe(false);
  });

  test('returns false if the dates are the same', () => {
    const date1 = new Date('2024-08-09');
    const date2 = new Date('2024-08-09');
    expect(isFirstDateEarlier(date1, date2)).toBe(false);
  });

  test('handles dates with different time components correctly', () => {
    const date1 = new Date('2024-08-09T10:00:00');
    const date2 = new Date('2024-08-09T12:00:00');
    expect(isFirstDateEarlier(date1, date2)).toBe(false);
  });

  test('handles dates with different time zones correctly', () => {
    const date1 = new Date('2024-08-09T00:00:00+02:00');
    const date2 = new Date('2024-08-08T22:00:00Z');
    expect(isFirstDateEarlier(date1, date2)).toBe(false);
  });
});
