import Box from '@mui/material/Box';

import { LoginNavigateButton } from '~/features/Login';
import { SignupNavigateButton } from '~/features/Signup';
import { useCustomTranslation } from '~/shared/utils';

interface AuthorizationButtonsProps {
  redirectState?: Record<string, unknown>;
}

export const AuthorizationButtons = ({ redirectState }: AuthorizationButtonsProps) => {
  const { t } = useCustomTranslation();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={1}
      fontSize={18}
      marginY={2}
    >
      <span>{t('please')}</span>
      <Box width={150}>
        <LoginNavigateButton redirectState={redirectState} />
      </Box>
      <span>{t('or')}</span>
      <Box width={150}>
        <SignupNavigateButton redirectState={redirectState} />
      </Box>
    </Box>
  );
};
