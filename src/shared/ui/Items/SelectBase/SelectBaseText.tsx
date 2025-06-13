import { Theme } from '~/shared/constants';
import Text from '~/shared/ui/Text';
import { useCustomWordWrap } from '~/shared/utils/hooks/useCustomWordWrap';

type Props = {
  text: string;
};

export const SelectBaseText = (props: Props) => {
  const { processedWords } = useCustomWordWrap(props.text);
  const hasLongWord = processedWords.some(({ needsWrap }) => needsWrap);

  return (
    <Text
      variant="body1"
      color={Theme.colors.light.onSurface}
      fontSize="18px"
      fontWeight="400"
      lineHeight="28px"
      testid="select-text"
      sx={{
        wordBreak: 'none',
        cursor: 'pointer',
        lineBreak: 'normal',
        display: '-webkit-box',
        webkitLineClamp: '3',
        webkitBoxOrient: 'vertical',
      }}
    >
      {hasLongWord
        ? processedWords.map(({ word, needsWrap, ref }, index) =>
            needsWrap ? (
              <span ref={ref} style={{ wordBreak: 'break-word' }} key={index}>
                {`${word} `}
              </span>
            ) : (
              `${word} `
            ),
          )
        : props.text}
    </Text>
  );
};
