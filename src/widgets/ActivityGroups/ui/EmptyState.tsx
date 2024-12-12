import { Avatar, Box, BoxProps } from '@mui/material';

import { Theme } from '~/shared/constants';
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
      <Text variant="h4" color={Theme.colors.light.outline} fontSize="24px" lineHeight="32px">
        {description}
      </Text>
    </Box>
  );
};
