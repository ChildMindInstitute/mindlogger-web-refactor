import Text from '~/shared/ui/Text';

type TextSegmentProps = { text: string; isAtStart?: boolean };

export const TextSegment = ({ text, isAtStart }: TextSegmentProps) => {
  const renderedText = isAtStart ? text : ` ${text}`;
  return (
    <Text component="span" fontSize="inherit" lineHeight="inherit">
      {renderedText}
    </Text>
  );
};
