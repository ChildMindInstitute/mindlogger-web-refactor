import { Box } from '~/shared/ui';
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

  const { lessThanTarget, greaterThanTarget } = useCustomMediaQuery(800);

  const isAxisHeaderForRow = axisHeaderFor === 'row';

  const imageHeight = lessThanTarget ? '44px' : '64px';
  const imageWidth = lessThanTarget ? '44px' : '64px';

  return (
    <Box
      display="flex"
      flex={maxWidth}
      data-testid={id}
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      {item && (
        <Box display="flex" flexDirection="column" alignItems="center" gap="4px">
          {(!isAxisHeaderForRow || !greaterThanTarget) && (
            <Text variant="body1" fontSize={lessThanTarget ? '14px' : '18px'}>
              {text}
            </Text>
          )}
          <Box
            display="flex"
            alignItems="center"
            gap="12px"
            height={!isAxisHeaderForRow ? imageHeight : undefined}
          >
            {imageUrl && (
              <AvatarBase
                src={item.imageUrl}
                variant="rounded"
                height={imageHeight}
                width={imageWidth}
                borderRadius="8px"
              />
            )}
            {!imageUrl && isAxisHeaderForRow && greaterThanTarget && (
              <Box height={imageHeight} width={imageWidth} />
            )}

            {isAxisHeaderForRow && greaterThanTarget && (
              <Text variant="body1" fontSize={lessThanTarget ? '14px' : '18px'}>
                {text}
              </Text>
            )}
            {tooltip && <CustomTooltip markdown={tooltip} />}
            {!tooltip && isAxisHeaderForRow && greaterThanTarget && (
              <Box height="24px" width="24px" />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
