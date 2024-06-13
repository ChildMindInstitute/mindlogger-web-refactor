import { BaseButton } from '~/shared/ui';
import Box from '~/shared/ui/Box';

type Props = {
  text: string;
  width: string;
  onClick: () => void;
};

export const StartSurveyButton = ({ onClick, width, text }: Props) => {
  return (
    <Box
      display="flex"
      flex={1}
      justifyContent="center"
      data-testid="start-assessment-widget"
      paddingY="23px"
    >
      <Box width={width}>
        <BaseButton type="button" variant="contained" onClick={onClick} text={text} />
      </Box>
    </Box>
  );
};
