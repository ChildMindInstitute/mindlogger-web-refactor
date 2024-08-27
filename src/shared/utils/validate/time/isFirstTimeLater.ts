import { HourMinute } from '~/shared/utils';

/**
 * Determines if the first time is later than the second time.
 *
 * @param {HourMinute} timeA - The first time object to compare.
 * @param {HourMinute} timeB - The second time object to compare.
 * @returns {boolean} - Returns `true` if `timeA` is later than `timeB`, otherwise `false`.
 *
 * @example
 * const time1 = { hours: 16, minutes: 0 };
 * const time2 = { hours: 15, minutes: 30 };
 *
 * console.log(isFirstTimeLater(time1, time2)); // true
 *
 * @example
 * const time1 = { hours: 14, minutes: 0 };
 * const time2 = { hours: 15, minutes: 30 };
 *
 * console.log(isFirstTimeLater(time1, time2)); // false
 *
 * @example
 * const time1 = { hours: 15, minutes: 45 };
 * const time2 = { hours: 15, minutes: 30 };
 *
 * console.log(isFirstTimeLater(time1, time2)); // true
 */
export const isFirstTimeLater = (timeA: HourMinute, timeB: HourMinute): boolean => {
  if (timeA.hours > timeB.hours) {
    return true;
  }

  if (timeA.hours === timeB.hours) {
    return timeA.minutes > timeB.minutes;
  }

  return false;
};
