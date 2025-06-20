import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

type Props = {
  message: string;
  testid?: string;
};

export const PageMessage = ({ message, testid }: Props) => {
  return (
    <Box
      display="flex"
      flex={1}
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      data-testid={testid}
    >
      <Text component="p" variant="headlineSmall" margin="16px 0px">
        {message}
      </Text>
    </Box>
  );
};
