import { useContext, useEffect, useState } from 'react';

import { getProgressId } from '../../../abstract/lib';
import { appletModel } from '../../../entities/applet';
import { formatTimerTime } from '../../../features/PassSurvey';
import { SurveyBasicContext } from '../lib';

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
  const basicContext = useContext(SurveyBasicContext);

  const [varForDeps, forceUpdate] = useState({});

  const { setTimer } = useTimer();

  const entityID = basicContext.flowId ? basicContext.flowId : basicContext.activityId;

  const group = useAppSelector((state) =>
    appletModel.selectors.selectGroupProgress(state, getProgressId(entityID, basicContext.eventId)),
  );

  const groupStartAt = group?.startAt ?? null;

  const getTimeToLeft = (startAt: Date) => {
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

  const showTimeToLeft = () => {
    if (!groupStartAt) {
      return formatTimerTime(entityTimerSettings);
    }

    const timeToLeft = getTimeToLeft(new Date(groupStartAt));

    if (!timeToLeft) {
      return '00:00';
    }

    return `${formatTimerTime(timeToLeft)} remaining`;
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
    <Box display="flex" padding="8px 12px" gap="8px" minWidth="175px">
      <ClockIcon width="24px" height="24px" color={Theme.colors.light.outline} />
      <Text color={Theme.colors.light.outline}>{showTimeToLeft()}</Text>
    </Box>
  );
};
