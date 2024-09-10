import { useContext, useEffect, useState } from 'react';

import { getProgressId } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { SurveyContext, formatTimerTime } from '~/features/PassSurvey';
import { MINUTES_IN_HOUR, MS_IN_MINUTE, Theme } from '~/shared/constants';
import { ClockIcon } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import {
  HourMinute,
  getMsFromHours,
  getMsFromMinutes,
  useAppSelector,
  useTimer,
} from '~/shared/utils';

type Props = {
  entityTimerSettings: HourMinute;
};

export const EntityTimer = ({ entityTimerSettings }: Props) => {
  const context = useContext(SurveyContext);

  const [varForDeps, forceUpdate] = useState({});

  const { setTimer } = useTimer();

  const group = useAppSelector((state) =>
    appletModel.selectors.selectGroupProgress(
      state,
      getProgressId(context.entityId, context.eventId, context.targetSubject?.id),
    ),
  );

  const groupStartAt = group?.startAt ?? null;

  const calculateTimeLeft = (startAt: Date) => {
    const activityDuration: number =
      getMsFromHours(entityTimerSettings.hours) + getMsFromMinutes(entityTimerSettings.minutes);

    const alreadyElapsed: number = new Date().getTime() - startAt.getTime();

    if (alreadyElapsed < activityDuration) {
      const left: number = activityDuration - alreadyElapsed;

      const hours = Math.floor(left / MS_IN_MINUTE / MINUTES_IN_HOUR);
      const minutes = Math.floor((left - getMsFromHours(hours)) / MS_IN_MINUTE);

      return { hours, minutes };
    } else {
      return null;
    }
  };

  const getTimeToLeft = () => {
    if (!groupStartAt) {
      return formatTimerTime(entityTimerSettings);
    }

    const timeToLeft = calculateTimeLeft(new Date(groupStartAt));

    if (!timeToLeft) {
      return '00:00';
    }

    return `${formatTimerTime(timeToLeft)} remaining`;
  };

  const checkLessThan10Mins = (): boolean => {
    if (!groupStartAt) {
      return false;
    }

    const timeToLeft = calculateTimeLeft(new Date(groupStartAt));

    if (!timeToLeft) {
      return false;
    }

    const timeLeftInMs = getMsFromHours(timeToLeft.hours) + getMsFromMinutes(timeToLeft.minutes);

    const isLessThan10Mins = timeLeftInMs < MS_IN_MINUTE * 10;

    return isLessThan10Mins;
  };

  const getColor = () => {
    const isLessThan10Mins = checkLessThan10Mins();

    return isLessThan10Mins ? Theme.colors.light.error : Theme.colors.light.outline;
  };

  useEffect(() => {
    if (groupStartAt) {
      setTimer({
        time: 1000 * 60,
        onComplete: () => {
          forceUpdate({});
        },
      });
    }
  }, [groupStartAt, setTimer, varForDeps]);

  return (
    <Box
      display="flex"
      gap="8px"
      minWidth="175px"
      sx={{
        animation: checkLessThan10Mins() ? 'blinking 1s infinite' : 'none',
        '@keyframes blinking': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.1 },
          '100%': { opacity: 1 },
        },
      }}
    >
      <ClockIcon width="24px" height="24px" color={getColor()} />
      <Text color={getColor()}>{getTimeToLeft()}</Text>
    </Box>
  );
};
