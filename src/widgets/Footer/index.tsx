import { Theme } from '~/shared/constants';
import { Box } from '~/shared/ui';
import { Text } from '~/shared/ui';
import { useCustomMediaQuery, useCustomTranslation } from '~/shared/utils';

export default function Footer() {
  const { t } = useCustomTranslation({ keyPrefix: 'footer' });

  const buildVersion = import.meta.env.VITE_BUILD_VERSION;

  const { greaterThanMD } = useCustomMediaQuery();

  return (
    <Box
      id="app-footer"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: Theme.colors.light.surface,
        borderTop: `1px solid ${Theme.colors.light.surfaceVariant}`,
      }}
    >
      <Box display="flex" alignItems="center" textAlign="center" marginY={3} gap={2}>
        {greaterThanMD && (
          <span>
            {t('product')}{' '}
            <a href="https://childmind.org" target="_blank" rel="noreferrer">
              Child Mind Institute
            </a>{' '}
            &#169; 2024
          </span>
        )}
        <a href="https://mindlogger.org/terms" target="_blank" rel="noreferrer">
          {t('termsOfService')}
        </a>
        <a href="https://help.mindlogger.org/" target="_blank" rel="noreferrer">
          {t('support')}
        </a>
        {buildVersion && (
          <Text variant="body1" color={Theme.colors.light.outlineVariant}>
            {buildVersion}
          </Text>
        )}
      </Box>
    </Box>
  );
}
