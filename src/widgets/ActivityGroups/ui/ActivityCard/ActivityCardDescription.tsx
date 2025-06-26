import { variables } from '~/shared/constants/theme/variables';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

type Props = {
  description: string;
  isFlow: boolean;
};

export const ActivityCardDescription = ({ description, isFlow }: Props) => {
  return (
    <Box data-testid={isFlow ? 'flow-card-description' : 'activity-card-description'}>
      <Text
        color={variables.palette.onSurface}
        variant="bodyLarge"
        sx={{
          textAlign: 'left',
        }}
      >
        {description}
      </Text>
    </Box>
  );
};
