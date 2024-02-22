import Box from '@mui/material/Box';

import { Theme } from '~/shared/constants';
import { BaseButton } from '~/shared/ui';
import { useCustomMediaQuery } from '~/shared/utils';

type ItemCardButtonsProps = {
  isLoading: boolean;
  isBackShown: boolean;

  backButtonText: string;
  nextButtonText: string;

  onBackButtonClick?: () => void;
  onNextButtonClick: () => void;
};

export const ItemCardButton = ({
  isBackShown,
  onBackButtonClick,
  onNextButtonClick,
  isLoading,
  nextButtonText,
  backButtonText,
}: ItemCardButtonsProps) => {
  const { greaterThanSM } = useCustomMediaQuery();

  return (
    <Box
      display="flex"
      flex={1}
      justifyContent="space-between"
      alignItems="center"
      margin="0 auto"
      padding={greaterThanSM ? '0px 24px' : '0px 16px'}
      maxWidth="900px"
    >
      {(isBackShown && (
        <Box width={greaterThanSM ? '200px' : '120px'} data-testid="assessment-back-button">
          <BaseButton
            type="button"
            variant="outlined"
            onClick={onBackButtonClick}
            text={backButtonText}
            borderColor={Theme.colors.light.outline}
          />
        </Box>
      )) || <div></div>}

      <Box width={greaterThanSM ? '200px' : '120px'} data-testid="assessment-next-button">
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
