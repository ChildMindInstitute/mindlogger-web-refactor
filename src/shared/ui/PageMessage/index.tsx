import Box from '@mui/material/Box';

import { Text } from '../Text';

interface PageMessageProps {
  message: string;
  testid?: string;
}

export const PageMessage = ({ message, testid }: PageMessageProps) => {
  return (
    <Box
      display="flex"
      flex={1}
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      data-testid={testid}
    >
      <Text variant="body1" fontSize="24px" margin="16px 0px">
        {message}
      </Text>
    </Box>
  );
};
