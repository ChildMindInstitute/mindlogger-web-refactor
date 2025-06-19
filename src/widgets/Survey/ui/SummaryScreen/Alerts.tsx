import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import { variables } from '~/shared/constants/theme/variables';
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
      bgcolor={variables.palette.error50}
      borderRadius="12px"
      data-testid="alerts-container"
    >
      <Text variant="headlineSmall" testid="alerts-title">
        {t('alerts')}
      </Text>
      <Box>
        {alerts.map((alert, index) => (
          <Box display="flex" gap="8px" key={index} marginTop="16px" data-testid="alert-item">
            <NotificationImportantIcon
              fontSize="small"
              sx={{ color: variables.palette.error50 }}
              data-testid="alert-item-icon"
            />
            <Text variant="bodyLarge" testid="alert-item-label">
              {alert}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
