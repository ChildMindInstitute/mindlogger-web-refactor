import { isTimesEqual } from './isTimesEqual';

import { HourMinute } from '~/shared/utils';

describe('isEqual', () => {
  it('should return true when hours and minutes are the same', () => {
    const timeA: HourMinute = { hours: 15, minutes: 10 };
    const timeB: HourMinute = { hours: 15, minutes: 10 };
    expect(isTimesEqual(timeA, timeB)).toBe(true);
  });

  it('should return false when hours are different', () => {
    const timeA: HourMinute = { hours: 14, minutes: 10 };
    const timeB: HourMinute = { hours: 15, minutes: 10 };
    expect(isTimesEqual(timeA, timeB)).toBe(false);
  });

  it('should return false when minutes are different', () => {
    const timeA: HourMinute = { hours: 15, minutes: 5 };
    const timeB: HourMinute = { hours: 15, minutes: 10 };
    expect(isTimesEqual(timeA, timeB)).toBe(false);
  });

  it('should return false when both hours and minutes are different', () => {
    const timeA: HourMinute = { hours: 14, minutes: 5 };
    const timeB: HourMinute = { hours: 15, minutes: 10 };
    expect(isTimesEqual(timeA, timeB)).toBe(false);
  });
});
