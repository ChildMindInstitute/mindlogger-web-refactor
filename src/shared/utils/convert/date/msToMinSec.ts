export function convertMillisecondsToMinSec(milliseconds: number): string {
  // Calculate total seconds from milliseconds
  const totalSeconds = Math.floor(milliseconds / 1000);

  return convertSecondsToMinSec(totalSeconds);
}

export function convertSecondsToMinSec(value: number) {
  // Calculate minutes and seconds
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  // Format seconds to always have two digits
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // Return the formatted time string
  return `${minutes}:${formattedSeconds}`;
}
