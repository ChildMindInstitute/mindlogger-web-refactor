import { useXScaledDimension } from './hooks';

import { Theme } from '~/shared/constants';
import Text from '~/shared/ui/Text';

export const Header = ({ children }: { children: string }) => {
  const headerFontSize = useXScaledDimension(20);

  return (
    <Text
      fontSize={`${headerFontSize}px`}
      fontWeight="700"
      lineHeight="28px"
      color={Theme.colors.light.onSurface}
    >
      {children}
    </Text>
  );
};
