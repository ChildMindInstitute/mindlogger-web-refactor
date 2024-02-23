export type HourMinuteDTO = {
  hours: number;
  minutes: number;
};

export const dateToHourMinute = (date: Date): HourMinuteDTO => {
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
};

export const validateTime = (date: Date): boolean => {
  const hourMinute = dateToHourMinute(date);

  const isHourValid = 0 <= hourMinute.hours && hourMinute.hours < 24;
  const isMinuteValid = 0 <= hourMinute.minutes && hourMinute.minutes < 60;

  return isHourValid && isMinuteValid;
};
