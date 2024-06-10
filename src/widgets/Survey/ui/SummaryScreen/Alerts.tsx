import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomTranslation } from '~/shared/utils';

type Props = {
  alerts: string[];
};

export const Alerts = ({ alerts }: Props) => {
  const { t } = useCustomTranslation();

  return (
    <Box
      padding="24px 32px"
      bgcolor={Theme.colors.light.errorVariant10}
      borderRadius="12px"
      data-testid="alerts-container"
    >
      <Text fontWeight="600" fontSize="24px" lineHeight="32px" testid="alerts-title">
        {t('alerts')}
      </Text>
      <Box>
        {alerts.map((alert, index) => (
          <Box display="flex" gap="8px" key={index} marginTop="16px" data-testid="alert-item">
            <NotificationImportantIcon
              fontSize="small"
              sx={{ color: Theme.colors.light.errorVariant100 }}
              data-testid="alert-item-icon"
            />
            <Text fontWeight="400" fontSize="16px" lineHeight="22px" testid="alert-item-label">
              {alert}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
