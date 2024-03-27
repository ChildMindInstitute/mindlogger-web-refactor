import Box from '@mui/material/Box';

import { MatrixCell } from './MatrixCell';

import { AvatarBase, CustomTooltip, Text } from '~/shared/ui';
import { useCustomMediaQuery } from '~/shared/utils';

export type AxisItem = {
  id: string;
  text: string;
  imageUrl: string | null;
  tooltip: string | null;
};

type Props = {
  item: AxisItem | null;
  maxWidth: number;
  axisHeaderFor: 'column' | 'row';
};

export const AxisListItem = ({ item, maxWidth, axisHeaderFor }: Props) => {
  const { id, text, imageUrl, tooltip } = item || {};

  const { lessThanTarget, greaterThanTarget } = useCustomMediaQuery(700);

  const isAxisHeaderForRow = axisHeaderFor === 'row';

  return (
    <Box display="flex" flex={maxWidth} data-testid={id}>
      <MatrixCell>
        {item && (
          <Box display="flex" flexDirection="column" alignItems="center" gap="4px">
            {(!isAxisHeaderForRow || !greaterThanTarget) && (
              <Text variant="body1" fontSize={lessThanTarget ? '14px' : '18px'}>
                {text}
              </Text>
            )}
            <Box display="flex" alignItems="center" gap="12px">
              {imageUrl && (
                <AvatarBase
                  src={item.imageUrl}
                  variant="rounded"
                  height={lessThanTarget ? '44px' : '64px'}
                  width={lessThanTarget ? '44px' : '64px'}
                  borderRadius="8px"
                />
              )}
              {isAxisHeaderForRow && greaterThanTarget && (
                <Text variant="body1" fontSize={lessThanTarget ? '14px' : '18px'}>
                  {text}
                </Text>
              )}
              {tooltip && <CustomTooltip markdown={tooltip} />}
            </Box>
          </Box>
        )}
      </MatrixCell>
    </Box>
  );
};
