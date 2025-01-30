/**
 * Parses a date string to a Date object, appending 'T00:00:00' to remove timezone offset
 */
export const parseDateToMidnightUTC = (dateStr: string) => {
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);

  if (!dateMatch) {
    throw new Error('[parseDateToMidnightUTC] Invalid date string format');
  }

  return new Date(`${dateStr}T00:00:00`);
};
