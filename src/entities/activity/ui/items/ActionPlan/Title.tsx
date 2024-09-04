import { useXScaledDimension } from './hooks';

import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

export const Title = ({ children }: { children: string }) => {
  const titleFontSize = useXScaledDimension(16);
  const scaledTopPadding = useXScaledDimension(24);
  const scaledRightPadding = useXScaledDimension(48);
  const scaledBottomPadding = useXScaledDimension(12);
  const scaledLeftPadding = useXScaledDimension(40);
  const letterSpacing = useXScaledDimension(0.15);

  return (
    <Box
      paddingTop={`${scaledTopPadding}px`}
      paddingBottom={`${scaledBottomPadding}px`}
      paddingRight={`${scaledRightPadding}px`}
      paddingLeft={`${scaledLeftPadding}px`}
      display={'flex'}
      alignItems="center"
      justifyContent="center"
    >
      <Text
        fontSize={`${titleFontSize}px`}
        fontWeight="700"
        lineHeight="24px"
        letterSpacing={`${letterSpacing}px`}
        color={Theme.colors.light.onSurface}
        sx={{ textAlign: 'center' }}
      >
        {children}
      </Text>
    </Box>
  );
};
