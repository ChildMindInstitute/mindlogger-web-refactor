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
      testid="select-text"
      sx={{
        cursor: 'pointer',
        lineBreak: 'anywhere',
        display: '-webkit-box',
        overflow: 'hidden',

        // Using kebab-case (i.e. `-webkit-some-things`) would cause warnings
        // in the JS console about kebab-case being not supported for CSS
        // properties.
        webkitLineClamp: '3',
        webkitBoxOrient: 'vertical',
      }}
    >
      {props.text}
    </Text>
  );
};
