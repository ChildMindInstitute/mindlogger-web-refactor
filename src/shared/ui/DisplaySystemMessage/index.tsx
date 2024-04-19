import { Theme } from '../../constants';

import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

interface ErrorLabelProps {
  errorMessage?: string | null;
  successMessage?: string | null;
}

export const DisplaySystemMessage = ({ errorMessage, successMessage }: ErrorLabelProps) => {
  return (
    <Box minHeight="8px" maxHeight="64px" padding="4px 0">
      {errorMessage && (
        <Text fontSize="14px" color={Theme.colors.light.error} testid="system-error-message">
          {errorMessage}
        </Text>
      )}

      {successMessage && (
        <Text
          fontSize="14px"
          color={Theme.colors.light.accentGreen}
          testid="system-success-message"
        >
          {successMessage}
        </Text>
      )}
    </Box>
  );
};
