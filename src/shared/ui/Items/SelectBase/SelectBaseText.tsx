import { variables } from '~/shared/constants/theme/variables';
import Text from '~/shared/ui/Text';
import { useCustomWordWrap } from '~/shared/utils/hooks/useCustomWordWrap';

type Props = {
  text: string;
};

export const SelectBaseText = (props: Props) => {
  const { processedWords } = useCustomWordWrap(props.text);

  return (
    <Text
      color={variables.palette.onSurface}
      variant="bodyLarger"
      testid="select-text"
      sx={{
        wordBreak: 'none',
        cursor: 'pointer',
        lineBreak: 'normal',
        display: '-webkit-box',

        // Using kebab-case (i.e. `-webkit-some-things`) would cause warnings
        // in the JS console about kebab-case being not supported for CSS
        // properties.
        webkitLineClamp: '3',
        webkitBoxOrient: 'vertical',
      }}
    >
      {processedWords.map(({ word, needsWrap, ref }, index) => {
        return needsWrap ? (
          <span ref={ref} style={{ wordBreak: 'break-word' }} key={index}>
            {`${word} `}
          </span>
        ) : (
          `${word} `
        );
      })}
    </Text>
  );
};
