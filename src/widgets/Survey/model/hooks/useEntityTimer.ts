import { useEffect, useRef } from 'react';

import { HourMinute, getMsFromHours, getMsFromMinutes, useTimer } from '~/shared/utils';

type Props = {
  hourMinuteTimer: HourMinute;
  onFinish: () => void;
  entityStartedAt: number;
};

export const useEntityTimer = (props: Props) => {
  const { hourMinuteTimer, onFinish, entityStartedAt } = props;

  const { setTimer, resetTimer } = useTimer();

  const finishRef = useRef(onFinish);

  finishRef.current = onFinish;

  const entityDuration: number =
    getMsFromHours(hourMinuteTimer.hours) + getMsFromMinutes(hourMinuteTimer.minutes);

  const timerLogicIsUsed = entityDuration > 0;

  useEffect(() => {
    if (!timerLogicIsUsed) {
      return;
    }

    const alreadyElapsed: number = Date.now() - entityStartedAt;

    const noTimeLeft: boolean = alreadyElapsed > entityDuration;

    if (noTimeLeft) {
      finishRef.current();
    }

    const durationLeft = entityDuration - alreadyElapsed;

    setTimer({
      time: durationLeft,
      onComplete: () => {
        finishRef.current();
      },
    });

    return () => {
      resetTimer();
    };
  }, [entityDuration, entityStartedAt, resetTimer, setTimer, timerLogicIsUsed]);
};
