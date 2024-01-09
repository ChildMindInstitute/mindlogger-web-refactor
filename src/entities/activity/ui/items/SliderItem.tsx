import { SliderItem as SliderItemType } from "../../lib"

import { SliderItemBase } from "~/shared/ui"

type SliderItemProps = {
  item: SliderItemType
  value: string
  onValueChange: (value: string[]) => void
  isDisabled: boolean
}

export const SliderItem = ({ value, item, onValueChange, isDisabled }: SliderItemProps) => {
  const { responseValues, config } = item

  const onHandleValueChange = (value: string) => {
    onValueChange([value])
  }

  return (
    <SliderItemBase
      value={value}
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
  )
}
