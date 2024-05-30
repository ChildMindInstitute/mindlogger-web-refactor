export function convertMillisecondsToMinSec(milliseconds: number): string {
  // Calculate total seconds from milliseconds
  const totalSeconds = Math.floor(milliseconds / 1000);

  // Calculate minutes and seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Format seconds to always have two digits
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  // Return the formatted time string
  return `${minutes}:${formattedSeconds}`;
}
