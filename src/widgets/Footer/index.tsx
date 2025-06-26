import { variables } from '~/shared/constants/theme/variables';
import { Box, Text } from '~/shared/ui';
import { useCustomMediaQuery, useCustomTranslation } from '~/shared/utils';

export default function Footer() {
  const { t } = useCustomTranslation({ keyPrefix: 'footer' });
  const currentYear = new Date().getFullYear();

  const buildVersion = import.meta.env.VITE_BUILD_VERSION;

  const { greaterThanMD } = useCustomMediaQuery();

  return (
    <Box
      id="app-footer"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundColor: variables.palette.surface,
        borderTop: `1px solid ${variables.palette.surfaceVariant}`,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        textAlign="center"
        marginY={3}
        gap={2}
        sx={{
          '& a': {
            color: variables.palette.primary,
            textDecoration: 'underline',
            '&:hover': { textDecoration: 'none' },
          },
        }}
      >
        {greaterThanMD && (
          <span>
            {t('product')}{' '}
            <a href="https://childmind.org" target="_blank" rel="noreferrer">
              Child Mind Institute
            </a>{' '}
            &#169; {currentYear}
          </span>
        )}
        <a href="https://mindlogger.org/terms" target="_blank" rel="noreferrer">
          {t('termsOfService')}
        </a>
        <a href="https://mindlogger.org/privacy-policy" target="_blank" rel="noreferrer">
          {t('privacy')}
        </a>
        <a href="https://help.mindlogger.org/" target="_blank" rel="noreferrer">
          {t('support')}
        </a>
        {buildVersion && <Text color={variables.palette.outlineVariant}>{buildVersion}</Text>}
      </Box>
    </Box>
  );
}
