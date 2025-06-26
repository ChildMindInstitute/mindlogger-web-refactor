import { variables } from '~/shared/constants/theme/variables';
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
        <Text variant="bodyMedium" color={variables.palette.error} testid="system-error-message">
          {errorMessage}
        </Text>
      )}

      {successMessage && (
        <Text variant="bodyMedium" color={variables.palette.green} testid="system-success-message">
          {successMessage}
        </Text>
      )}
    </Box>
  );
};
