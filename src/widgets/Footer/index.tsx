import { Theme } from '~/shared/constants';
import { Box } from '~/shared/ui';
import { Text } from '~/shared/ui';
import { useCustomMediaQuery } from '~/shared/utils';

export default function Footer() {
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
            Mindlogger is a product of the{' '}
            <a href="https://childmind.org" target="_blank" rel="noreferrer">
              Child Mind Institute
            </a>{' '}
            &#169; 2024
          </span>
        )}
        <a href="https://mindlogger.org/terms" target="_blank" rel="noreferrer">
          Terms
        </a>
        <a href="https://mindlogger.org/privacy-policy" target="_blank" rel="noreferrer">
          Privacy
        </a>
        <a href="https://help.mindlogger.org/" target="_blank" rel="noreferrer">
          Support
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
