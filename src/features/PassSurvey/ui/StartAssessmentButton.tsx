import { Box } from '~/shared/ui';
import { BaseButton } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  width: string;
  onClick: () => void;
};

export const StartAssessmentButton = ({ onClick, width }: Props) => {
  const { t } = useCustomTranslation();

  return (
    <Box
      display="flex"
      flex={1}
      justifyContent="center"
      data-testid="start-assessment-widget"
      paddingY="23px"
    >
      <Box width={width}>
        <BaseButton type="button" variant="contained" onClick={onClick} text={t('start')} />
      </Box>
    </Box>
  );
};
