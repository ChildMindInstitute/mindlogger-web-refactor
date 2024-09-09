import Text from '~/shared/ui/Text';

type TextSegmentProps = { text: string; leadingSpace?: boolean };

export const TextSegment = ({ text, leadingSpace }: TextSegmentProps) => {
  return (
    <Text component="span" fontSize="inherit" lineHeight="inherit">
      {leadingSpace ? ' ' : ''}
      {text}
    </Text>
  );
};
