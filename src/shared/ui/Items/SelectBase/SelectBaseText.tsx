import { variables } from '~/shared/constants/theme/variables';
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
      color={variables.palette.onSurface}
      variant="bodyLarger"
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
