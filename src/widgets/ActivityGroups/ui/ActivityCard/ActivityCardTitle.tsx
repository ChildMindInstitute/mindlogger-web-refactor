import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

type Props = {
  title: string;
  isFlow: boolean;
};

export const ActivityCardTitle = ({ title, isFlow }: Props) => {
  return (
    <Box data-testid={isFlow ? 'flow-card-title' : 'activity-card-title'}>
      <Text
        variant="h3"
        color={Theme.colors.light.primary}
        fontSize="20px"
        fontWeight="700"
        lineHeight="28px"
      >
        {title}
      </Text>
    </Box>
  );
};
