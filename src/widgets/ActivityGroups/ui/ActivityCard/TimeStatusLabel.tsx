import Avatar from '@mui/material/Avatar';
import { Theme as MuiTheme, SxProps } from '@mui/material/styles';
import { addDays, startOfDay } from 'date-fns';

import { ActivityListItem, ActivityStatus } from '~/abstract/lib/GroupBuilder';
import ClockIcon from '~/assets/Clock.svg';
import { variables } from '~/shared/constants/theme/variables';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { convertToTimeOnNoun, useCustomTranslation } from '~/shared/utils';

interface TimeStatusLabelProps {
  activity: ActivityListItem;
}

const TimeStatusLabel = ({ activity }: TimeStatusLabelProps) => {
  const { t } = useCustomTranslation();

  const isStatusScheduled = activity.status === ActivityStatus.Scheduled;

  const isStatusInProgress = activity.status === ActivityStatus.InProgress;

  const hasAvailableFromTo = isStatusScheduled;

  const hasTimeToComplete =
    isStatusInProgress && activity.isTimerSet && !!activity.timeLeftToComplete;

  const tomorrow = addDays(startOfDay(new Date()), 1);

  const isSpreadToNextDay = !!activity.availableTo && activity.availableTo > tomorrow;

  const isEntityAlwaysAvailable = activity.isAlwaysAvailable;

  const formatDate = (date: Date | null): string => {
    if (!date) {
      throw new Error('[TimeStatusLabel:FormatDate] Date is not provided');
    }

    const convertResult = convertToTimeOnNoun(date);
    if (convertResult.translationKey) {
      return t(convertResult.translationKey);
    } else {
      return convertResult.formattedDate ?? '';
    }
  };

  const timeStatusLabelSx: SxProps<MuiTheme> = {
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.15px',
    color: variables.palette.onSurfaceVariant,
  };

  if (isEntityAlwaysAvailable) {
    return <></>;
  }

  if (hasAvailableFromTo) {
    return (
      <Box display="flex" alignItems="center" gap="8px" data-testid="time-status-label">
        <Avatar src={ClockIcon} sx={{ width: '24px', height: '24px' }} />
        <Text sx={timeStatusLabelSx}>
          {`${t('activity_due_date.available')} ${formatDate(activity.availableFrom ?? null)} ${t(
            'activity_due_date.to',
          )} ${formatDate(activity.availableTo ?? null)} ${isSpreadToNextDay ? t('activity_due_date.the_following_day') : ''}`}
        </Text>
      </Box>
    );
  }

  if (hasTimeToComplete) {
    return (
      <Box display="flex" alignItems="center" gap="8px" data-testid="time-status-label">
        <Avatar src={ClockIcon} sx={{ width: '24px', height: '24px' }} />

        <Text sx={timeStatusLabelSx}>{`${t(
          'time_to_complete_hm',
          activity.timeLeftToComplete ?? {},
        )}`}</Text>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap="8px" data-testid="time-status-label">
      <Avatar src={ClockIcon} sx={{ width: '24px', height: '24px' }} />
      <Text sx={timeStatusLabelSx}>{`${t('activity_due_date.to')} ${formatDate(
        activity.availableTo ?? null,
      )} ${isSpreadToNextDay ? t('activity_due_date.the_following_day') : ''}`}</Text>
    </Box>
  );
};

export default TimeStatusLabel;
