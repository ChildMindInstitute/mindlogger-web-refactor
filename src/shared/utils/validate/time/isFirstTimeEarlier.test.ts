import { isFirstTimeEarlier } from './isFirstTimeEarlier';

import { HourMinute } from '~/shared/utils';

describe('isFirstTimeEarlier', () => {
  it('should return true when the first time is earlier in hours', () => {
    const timeA: HourMinute = { hours: 14, minutes: 30 };
    const timeB: HourMinute = { hours: 15, minutes: 0 };
    expect(isFirstTimeEarlier(timeA, timeB)).toBe(true);
  });

  it('should return false when the first time is later in hours', () => {
    const timeA: HourMinute = { hours: 16, minutes: 0 };
    const timeB: HourMinute = { hours: 15, minutes: 0 };
    expect(isFirstTimeEarlier(timeA, timeB)).toBe(false);
  });

  it('should return true when hours are the same and the first time is earlier in minutes', () => {
    const timeA: HourMinute = { hours: 15, minutes: 10 };
    const timeB: HourMinute = { hours: 15, minutes: 30 };
    expect(isFirstTimeEarlier(timeA, timeB)).toBe(true);
  });

  it('should return false when hours are the same and the first time is later in minutes', () => {
    const timeA: HourMinute = { hours: 15, minutes: 40 };
    const timeB: HourMinute = { hours: 15, minutes: 30 };
    expect(isFirstTimeEarlier(timeA, timeB)).toBe(false);
  });

  it('should return false when both times are identical', () => {
    const timeA: HourMinute = { hours: 15, minutes: 30 };
    const timeB: HourMinute = { hours: 15, minutes: 30 };
    expect(isFirstTimeEarlier(timeA, timeB)).toBe(false);
  });
});
