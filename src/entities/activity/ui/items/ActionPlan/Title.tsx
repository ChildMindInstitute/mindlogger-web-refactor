import { useXScaledDimension } from './hooks';

import { variables } from '~/shared/constants/theme/variables';
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
        variant="titleMediumBold"
        fontSize={`${titleFontSize}px`}
        letterSpacing={`${letterSpacing}px`}
        color={variables.palette.onSurface}
        sx={{ textAlign: 'center' }}
      >
        {children}
      </Text>
    </Box>
  );
};
