import { SliderItem as SliderItemType } from '../../lib';

import { Box } from '~/shared/ui';
import { SliderItemBase } from '~/shared/ui';

type SliderItemProps = {
  item: SliderItemType;
  value: string;
  onValueChange: (value: string[]) => void;
  isDisabled: boolean;
};

export const SliderItem = ({ value, item, onValueChange, isDisabled }: SliderItemProps) => {
  const { responseValues, config } = item;

  const onHandleValueChange = (value: string) => {
    onValueChange([value]);
  };

  return (
    <Box padding="0px 16px">
      <SliderItemBase
        value={value ? value : responseValues.minValue.toString()}
        minValue={responseValues.minValue}
        minLabel={responseValues.minLabel}
        minImage={responseValues.minImage}
        maxValue={responseValues.maxValue}
        maxLabel={responseValues.maxLabel}
        maxImage={responseValues.maxImage}
        onChange={onHandleValueChange}
        disabled={isDisabled}
        continiusSlider={config.continuousSlider}
        showStickLabel={config.showTickLabels}
        showStickMarks={config.showTickMarks}
      />
    </Box>
  );
};
