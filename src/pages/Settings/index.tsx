import Divider from '@mui/material/Divider';

import { userModel } from '~/entities/user';
import { ChangePasswordForm, useChangePasswordTranslation } from '~/features/ChangePassword';
import { Theme } from '~/shared/constants';
import { Box } from '~/shared/ui';
import { AvatarBase, Text } from '~/shared/ui';

function SettingsPage() {
  const { t } = useChangePasswordTranslation();
  const { user } = userModel.hooks.useUserState();

  return (
    <Box display="flex" flex={1} justifyContent="center" alignItems="center" textAlign="center">
      <Box margin="24px 0px" padding="0px 12px">
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Box sx={{ padding: '0px 15px' }}>
            <AvatarBase name={`${user?.firstName} ${user?.lastName}`} width="40px" height="40px" />
          </Box>
          <Text variant="h6" sx={{ marginBottom: '8px' }}>
            {t('settings', { name: `${user?.firstName} ${user?.lastName}` })}
          </Text>
        </Box>

        <Divider
          sx={{ backgroundColor: 'rgba(0,0,0, 0.5)', marginTop: '8px', marginBottom: '24px' }}
        />

        <Box display="flex" alignItems="center" flexDirection="column">
          <Text variant="h5" color={Theme.colors.light.primary}>
            {t('settingsTitle')}
          </Text>
          <ChangePasswordForm title={t('formTitle', { email: user?.email })} />
        </Box>
      </Box>
    </Box>
  );
}

export default SettingsPage;
