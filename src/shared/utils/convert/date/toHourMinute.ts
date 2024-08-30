export type HourMinuteDTO = {
  hours: number;
  minutes: number;
};

/**
 * Converts a Date object to an object containing the local hours and minutes.
 *
 * @param {Date} date - The date from which to extract the local hours and minutes.
 * @returns {HourMinuteDTO} An object containing the extracted local hours and minutes.
 *
 * @example
 * const date = new Date('2024-08-28T10:30:00Z');
 * const time = dateToHourMinute(date);
 * // time: { hours: 12, minutes: 30 } (depending on the local timezone)
 */
export const dateToHourMinute = (date: Date): HourMinuteDTO => {
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
};

/**
 * Converts a Date string to an object containing the hours and minutes as they appear in the string representation of the date, ignoring any time zone conversions.
 *
 * @param {String} dateStr - The date string from which to extract the raw hours and minutes.
 * @returns {HourMinuteDTO} An object containing the extracted raw hours and minutes.
 * @throws {Error} Throws an error if the date string format is invalid.
 *
 * @example
 * const dateStr = new Date('Wed Aug 28 2024 10:30:00 GMT+0000 (Central European Summer Time)').toString();
 * const time = dateToHourMinuteRaw(dateStr);
 * // time: { hours: 10, minutes: 30 }
 */
export const dateStringToHourMinuteRaw = (dateStr: string): HourMinuteDTO => {
  const timeMatch = dateStr.match(/(\d{2}):(\d{2}):(\d{2})/);

  if (!timeMatch) {
    throw new Error('[dateToHourMinuteRaw] Invalid date string format');
  }

  return {
    hours: parseInt(timeMatch[1], 10),
    minutes: parseInt(timeMatch[2], 10),
  };
};

export const validateTime = (date: Date): boolean => {
  const hourMinute = dateToHourMinute(date);

  const isHourValid = 0 <= hourMinute.hours && hourMinute.hours < 24;
  const isMinuteValid = 0 <= hourMinute.minutes && hourMinute.minutes < 60;

  return isHourValid && isMinuteValid;
};
