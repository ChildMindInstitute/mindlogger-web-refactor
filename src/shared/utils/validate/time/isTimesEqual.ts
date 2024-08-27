import { HourMinute } from '~/shared/utils';

/**
 * Compares two time objects and checks if they are equal.
 *
 * @param {HourMinute} timeA - The first time object to compare.
 * @param {HourMinute} timeB - The second time object to compare.
 * @returns {boolean} - Returns `true` if both time objects have the same hours and minutes, otherwise `false`.
 *
 * @example
 * const time1 = { hours: 15, minutes: 10 };
 * const time2 = { hours: 15, minutes: 10 };
 *
 * console.log(isEqual(time1, time2)); // true
 *
 * @example
 * const time1 = { hours: 14, minutes: 10 };
 * const time2 = { hours: 15, minutes: 10 };
 *
 * console.log(isEqual(time1, time2)); // false
 */
export const isTimesEqual = (timeA: HourMinute, timeB: HourMinute): boolean => {
  return timeA.hours === timeB.hours && timeA.minutes === timeB.minutes;
};
