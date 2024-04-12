import { Theme } from '~/shared/constants';
import Text from '~/shared/ui/Text';

type Props = {
  text: string;
};

export const SelectBaseText = (props: Props) => {
  return (
    <Text
      variant="body1"
      color={Theme.colors.light.onSurface}
      fontSize="18px"
      fontWeight="400"
      lineHeight="28px"
      data-testid="select-text"
      sx={{ cursor: 'pointer', lineBreak: 'anywhere' }}
    >
      {props.text}
    </Text>
  );
};
