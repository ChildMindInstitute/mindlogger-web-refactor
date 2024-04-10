import Text from '~/shared/ui/Text';

type Props = {
  text: string;
  color: string;
};

export const ActivityLabelTypography = ({ text, color }: Props) => {
  return (
    <Text color={color} fontSize="14px" fontWeight="400" lineHeight="20px" letterSpacing="0.1px">
      {text}
    </Text>
  );
};
