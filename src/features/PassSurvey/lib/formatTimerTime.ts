import { HourMinute } from '~/shared/utils';

export function formatTimerTime(timer: HourMinute): string {
  // Ensure minute is two digits
  const formattedMinute = timer.minutes.toString().padStart(2, '0');

  // Return formatted time string
  return `${timer.hours}:${formattedMinute}`;
}
