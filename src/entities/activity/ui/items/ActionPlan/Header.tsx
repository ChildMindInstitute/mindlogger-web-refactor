import { useXScaledDimension } from './hooks';

import { variables } from '~/shared/constants/theme/variables';
import Text from '~/shared/ui/Text';

export const Header = ({ children }: { children: string }) => {
  const headerFontSize = useXScaledDimension(20);

  return (
    <Text
      variant="titleLargeBold"
      fontSize={`${headerFontSize}px`}
      color={variables.palette.onSurface}
    >
      {children}
    </Text>
  );
};
