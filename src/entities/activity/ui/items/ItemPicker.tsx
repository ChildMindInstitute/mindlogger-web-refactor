import { ActivityEventProgressRecord } from "../../model/types"
import { CheckboxItem } from "./Checkbox"
import { RadioItem } from "./Radio"
import { SelectorItem } from "./Selector"
import { SliderItem } from "./Slider"
import { SplashScreen } from "./SplashScreen"
import { TextItem } from "./Text"

type ItemPickerProps = {
  item: ActivityEventProgressRecord

  values: string[]
  onValueChange: (value: string[]) => void
  isDisabled: boolean
}

export const ItemPicker = ({ item, values, onValueChange, isDisabled }: ItemPickerProps) => {
  switch (item.responseType) {
    case "splashScreen":
      return <SplashScreen imageSrc={item.config.imageSrc} />

    case "text":
      return <TextItem item={item} value={values[0]} onValueChange={onValueChange} isDisabled={isDisabled} />

    case "multiSelect":
      return <CheckboxItem item={item} values={values} onValueChange={onValueChange} isDisabled={isDisabled} />

    case "singleSelect":
      return <RadioItem item={item} value={values[0]} onValueChange={onValueChange} isDisabled={isDisabled} />

    case "slider":
      return <SliderItem item={item} value={values[0]} onValueChange={onValueChange} isDisabled={isDisabled} />

    case "numberSelect":
      return <SelectorItem item={item} value={values[0]} onValueChange={onValueChange} isDisabled={isDisabled} />

    default:
      return <></>
  }
}
