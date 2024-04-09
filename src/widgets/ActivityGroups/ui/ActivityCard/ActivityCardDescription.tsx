import { Theme } from '~/shared/constants';
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
        variant="body1"
        color={Theme.colors.light.onSurface}
        fontSize="16px"
        fontWeight="400"
        lineHeight="24px"
        letterSpacing="0.15px"
        sx={{
          textAlign: 'left',
        }}
      >
        {description}
      </Text>
    </Box>
  );
};
