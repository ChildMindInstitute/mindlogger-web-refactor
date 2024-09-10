import { MINUTES_IN_HOUR } from '~/shared/constants';
import { HourMinute } from '~/shared/utils';

/**
 * Determines if the first time is earlier than the second time.
 *
 * @param {HourMinute} timeA - The first time object to compare.
 * @param {HourMinute} timeB - The second time object to compare.
 * @returns {boolean} - Returns `true` if `timeA` is earlier than `timeB`, otherwise `false`.
 *
 * @example
 * const time1 = { hours: 14, minutes: 30 };
 * const time2 = { hours: 15, minutes: 0 };
 *
 * console.log(isFirstTimeEarlier(time1, time2)); // true
 *
 * @example
 * const time1 = { hours: 16, minutes: 0 };
 * const time2 = { hours: 15, minutes: 0 };
 *
 * console.log(isFirstTimeEarlier(time1, time2)); // false
 *
 * @example
 * const time1 = { hours: 15, minutes: 10 };
 * const time2 = { hours: 15, minutes: 30 };
 *
 * console.log(isFirstTimeEarlier(time1, time2)); // true
 */
export const isFirstTimeEarlier = (timeA: HourMinute, timeB: HourMinute): boolean => {
  return (
    timeA.hours * MINUTES_IN_HOUR + timeA.minutes < timeB.hours * MINUTES_IN_HOUR + timeB.minutes
  );
};
