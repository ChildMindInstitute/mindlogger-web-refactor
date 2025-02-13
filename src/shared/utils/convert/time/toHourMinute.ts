import { HourMinute } from '../../types';

/**
 * Converts a time string to an object containing hours and minutes.
 *
 * @param {string} timeStr - The time string from which to extract the local hours and minutes.
 * @returns {HourMinute} An object containing the extracted local hours and minutes.
 *
 * @example
 * const timeStr = '10:30';
 * const time = timeToHourMinute(timeStr);
 * // time: { hours: 10, minutes: 30 }
 */
export const timeToHourMinute = (timeStr: string): HourMinute => {
  const timeMatch = timeStr.match(/^(\d{2}):(\d{2})$/);
  if (!timeMatch) {
    throw new Error('[timeToHourMinute] Invalid time string format');
  }

  return {
    hours: parseInt(timeMatch[1]),
    minutes: parseInt(timeMatch[2]),
  };
};
