import { Avatar, Box, BoxProps } from '@mui/material';

import { variables } from '~/shared/constants/theme/variables';
import { Text } from '~/shared/ui';

type Props = BoxProps & {
  icon: string;
  description: string;
};

export const EmptyState = ({ icon, description, ...rest }: Props) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      py="16px"
      gap="16px"
      {...rest}
    >
      <Avatar src={icon} sx={{ width: '80px', height: '80px', borderRadius: 0 }} />
      <Text color={variables.palette.outline} variant="headlineSmall">
        {description}
      </Text>
    </Box>
  );
};
