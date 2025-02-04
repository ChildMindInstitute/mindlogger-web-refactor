/**
 * Parses a date string to a Date object, appending 'T00:00:00Z' to remove timezone offset
 *
 * @param {String} dateStr - The date string from which to extract the raw hours and minutes.
 * @returns {Date} An object containing the extracted raw hours and minutes.
 * @throws {Error} Throws an error if the date string format is invalid.
 *
 * @example
 * const dateStr = '2025-01-01';
 * const date = parseDateToMidnightUTC(dateStr);
 * // date: 2025-01-01T00:00:00.000Z
 */
export const parseDateToMidnightUTC = (dateStr: string) => {
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);

  if (!dateMatch) {
    throw new Error('[parseDateToMidnightUTC] Invalid date string format');
  }

  return new Date(`${dateStr}T00:00:00Z`);
};
