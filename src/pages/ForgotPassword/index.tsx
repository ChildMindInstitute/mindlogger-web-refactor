import { ForgotPasswordForm } from '~/features/ForgotPassword';
import { variables } from '~/shared/constants/theme/variables';
import { Box, Text } from '~/shared/ui';
import { useCustomTranslation } from '~/shared/utils';

function ForgotPasswordPage() {
  const { t } = useCustomTranslation({ keyPrefix: 'ForgotPassword' });

  return (
    <Box display="flex" flex={1}>
      <Box flex={1} textAlign="center" margin="24px 0px" padding="0px 12px">
        <Text variant="titleLargishBold" margin="16px 0px">
          {t('title')}
        </Text>

        <Box bgcolor={variables.palette.onPrimary} padding="10px" maxWidth="400px" margin="0 auto">
          <ForgotPasswordForm />
        </Box>
      </Box>
    </Box>
  );
}
export default ForgotPasswordPage;
