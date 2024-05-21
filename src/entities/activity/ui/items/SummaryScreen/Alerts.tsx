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
    <Box padding="24px 32px" bgcolor={Theme.colors.light.errorVariant10} borderRadius="12px">
      <Text fontWeight="600" fontSize="24px" lineHeight="32px">
        {t('alerts')}
      </Text>
      <Box>
        {alerts.map((alert, index) => (
          <Box display="flex" gap="8px" key={index} marginTop="16px">
            <NotificationImportantIcon
              fontSize="small"
              sx={{ color: Theme.colors.light.errorVariant100 }}
            />
            <Text fontWeight="400" fontSize="16px" lineHeight="22px">
              {alert}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
