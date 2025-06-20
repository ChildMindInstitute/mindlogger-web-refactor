import { variables } from '~/shared/constants/theme/variables';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

type Props = {
  title: string;
  isFlow: boolean;
};

export const ActivityCardTitle = ({ title, isFlow }: Props) => {
  return (
    <Box data-testid={isFlow ? 'flow-card-title' : 'activity-card-title'}>
      <Text color={variables.palette.primary} variant="titleLargishBold">
        {title}
      </Text>
    </Box>
  );
};
