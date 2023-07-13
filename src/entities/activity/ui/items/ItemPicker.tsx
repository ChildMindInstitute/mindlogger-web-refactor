import { ActivityEventProgressRecord } from "../../model/types"
import { CheckboxItem } from "./Checkbox"
import { DateItem } from "./Date"
import { RadioItem } from "./Radio"
import { SelectorItem } from "./Selector"
import { SliderItem } from "./Slider"
import { SplashScreen } from "./SplashScreen"
import { TextItem } from "./Text"
import { TimeItem } from "./Time"
import { TimeRangeItem } from "./TimeRange"

type ItemPickerProps = {
  item: ActivityEventProgressRecord

  values: string[]
  onValueChange: (value: string[]) => void
  isDisabled: boolean
  replaceText: (value: string) => string
}

export const ItemPicker = ({ item, values, onValueChange, isDisabled, replaceText }: ItemPickerProps) => {
  switch (item.responseType) {
    case "splashScreen":
      return <SplashScreen imageSrc={item.config.imageSrc} />

    case "text":
      return <TextItem item={item} value={values[0]} onValueChange={onValueChange} isDisabled={isDisabled} />

    case "multiSelect":
      return (
        <CheckboxItem
          item={item}
          values={values}
          onValueChange={onValueChange}
          isDisabled={isDisabled}
          replaceText={replaceText}
        />
      )

    case "singleSelect":
      return (
        <RadioItem
          item={item}
          value={values[0]}
          onValueChange={onValueChange}
          isDisabled={isDisabled}
          replaceText={replaceText}
        />
      )

    case "slider":
      return <SliderItem item={item} value={values[0]} onValueChange={onValueChange} isDisabled={isDisabled} />

    case "numberSelect":
      return <SelectorItem item={item} value={values[0]} onValueChange={onValueChange} isDisabled={isDisabled} />

    case "message":
      return <></>

    case "date":
      return <DateItem value={values[0]} onValueChange={onValueChange} />

    case "time":
      return <TimeItem value={values[0]} onValueChange={onValueChange} width="160px" />

    case "timeRange":
      return <TimeRangeItem values={values} onValueChange={onValueChange} />

    default:
      return <></>
  }
}
