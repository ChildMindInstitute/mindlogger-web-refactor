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
 * @returns {boolean} - `true` if the first date is later than the second date, otherwise `false`.
 */
export const isFirstDateLater = (firstDate: Date, secondDate: Date): boolean => {
  const startOfDay1 = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
  const startOfDay2 = new Date(
    secondDate.getFullYear(),
    secondDate.getMonth(),
    secondDate.getDate(),
  );

  return compareAsc(startOfDay1, startOfDay2) === 1;
};
