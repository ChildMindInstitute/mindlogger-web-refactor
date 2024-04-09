import Typography from '@mui/material/Typography';

import { Theme } from '../../constants';

import { Box } from '~/shared/ui';

interface ErrorLabelProps {
  errorMessage?: string | null;
  successMessage?: string | null;
}

export const DisplaySystemMessage = ({ errorMessage, successMessage }: ErrorLabelProps) => {
  return (
    <Box minHeight="8px" maxHeight="64px" padding="4px 0">
      {errorMessage && (
        <Typography
          fontSize="14px"
          color={Theme.colors.light.error}
          data-testid="system-error-message"
        >
          {errorMessage}
        </Typography>
      )}

      {successMessage && (
        <Typography
          fontSize="14px"
          color={Theme.colors.light.accentGreen}
          data-testid="system-success-message"
        >
          {successMessage}
        </Typography>
      )}
    </Box>
  );
};
