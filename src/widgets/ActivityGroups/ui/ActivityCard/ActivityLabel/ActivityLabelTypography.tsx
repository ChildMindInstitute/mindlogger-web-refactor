import Text from '~/shared/ui/Text';

type Props = {
  text: string;
  color: string;
};

export const ActivityLabelTypography = ({ text, color }: Props) => {
  return (
    <Text color={color} variant="bodyMedium" sx={{ whiteSpace: 'nowrap' }}>
      {text}
    </Text>
  );
};
