import { compareAsc } from 'date-fns';

/**
 * Compares two dates and checks if the first date is later than the second date.
 *
 * This function uses `compareAsc` from `date-fns` to compare two `Date` objects.
 * It returns `1` if the first date is later than the second date, ignoring
 * the time component. If the first date is earlier, it returns `-1`.
 * If the dates are the same, it returns `0`.
 *
 * @param {Date} firstDate - The first date to compare.
 * @param {Date} secondDate - The second date to compare.
 * @returns {boolean} - `true` if the first date is earlier than the second date, otherwise `false`.
 */
export const isFirstDateEarlier = (firstDate: Date, secondDate: Date): boolean => {
  return compareAsc(firstDate, secondDate) === -1;
};
