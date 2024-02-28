export const formatDuration = (duration: number) => {
  if (!duration || duration <= 0) {
    return '00:00';
  }

  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${formattedMinutes}:${formattedSeconds}`;
};
