import Text from '~/shared/ui/Text';

type TextSegmentProps = { text: string };

export const TextSegment = ({ text }: TextSegmentProps) => {
  return (
    <Text component="span" fontSize="inherit" lineHeight="inherit">
      {text}
    </Text>
  );
};
