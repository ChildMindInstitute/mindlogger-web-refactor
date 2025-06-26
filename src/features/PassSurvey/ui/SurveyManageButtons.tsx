import { TimerSettings } from '../hooks';
import { ItemTimerBar } from './ItemTimerBar';

import { BaseButton, Text } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import { useCustomMediaQuery } from '~/shared/utils';

type ItemCardButtonsProps = {
  isLoading: boolean;
  isBackShown: boolean;

  backButtonText?: string;
  nextButtonText: string;

  onBackButtonClick?: () => void;
  onNextButtonClick: () => void;

  timerSettings?: TimerSettings;
};

export const SurveyManageButtons = ({
  isBackShown,
  onBackButtonClick,
  onNextButtonClick,
  isLoading,
  nextButtonText,
  backButtonText,
  timerSettings,
}: ItemCardButtonsProps) => {
  const { greaterThanSM } = useCustomMediaQuery();

  const isTimerPropertyExist = (value: number | null): value is number => {
    return value !== null;
  };

  return (
    <Box
      display="flex"
      flex={1}
      justifyContent="space-between"
      alignItems="center"
      margin="0 auto"
      padding={greaterThanSM ? '0px 24px' : '0px 16px'}
      maxWidth="900px"
      paddingY="23px"
      position="relative"
    >
      {timerSettings &&
        isTimerPropertyExist(timerSettings.progress) &&
        isTimerPropertyExist(timerSettings.duration) &&
        isTimerPropertyExist(timerSettings.time) && (
          <ItemTimerBar
            progress={timerSettings.progress}
            time={timerSettings.time}
            duration={timerSettings.duration}
          />
        )}

      {(isBackShown && (
        <Box width={greaterThanSM ? '208px' : '120px'} data-testid="assessment-back-button">
          <BaseButton
            type="button"
            variant="outlined"
            onClick={onBackButtonClick}
            text={backButtonText}
          >
            <Text variant="titleMedium">{backButtonText}</Text>
          </BaseButton>
        </Box>
      )) || <div></div>}

      <Box width={greaterThanSM ? '208px' : '120px'} data-testid="assessment-next-button">
        <BaseButton
          type="button"
          variant="contained"
          isLoading={isLoading}
          onClick={onNextButtonClick}
          text={nextButtonText}
        />
      </Box>
    </Box>
  );
};
