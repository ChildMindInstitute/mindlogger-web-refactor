import { MS_IN_SEC } from './session.const';

// Rounds up, so the last second reads 0:01 rather than 0:00 with time still on the clock.
export const formatCountdown = (ms: number) => {
  const totalSeconds = Math.max(Math.ceil(ms / MS_IN_SEC), 0);

  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
};
