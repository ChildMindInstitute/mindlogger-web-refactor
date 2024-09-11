import Text from '~/shared/ui/Text';

type TextSegmentProps = { text: string; isAtStart?: boolean };

export const TextSegment = ({ text, isAtStart }: TextSegmentProps) => {
  return (
    <Text component="span" fontSize="inherit" lineHeight="inherit">
      {isAtStart ? '' : ' '}
      {text}
    </Text>
  );
};
