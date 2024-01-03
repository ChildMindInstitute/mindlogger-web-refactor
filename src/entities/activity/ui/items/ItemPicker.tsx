import { ItemRecord } from "../../../applet/model/types"
import { AudioPlayerItem } from "./AudioPlayerItem"
import { CheckboxItem } from "./CheckboxItem"
import { DateItem } from "./DateItem"
import { RadioItem } from "./RadioItem"
import { SelectorItem } from "./SelectorItem"
import { SliderItem } from "./SliderItem"
import { SplashScreen } from "./SplashScreen"
import { TextItem } from "./TextItem"
import { TimeItem } from "./TimeItem"
import { TimeRangeItem } from "./TimeRangeItem"

type ItemPickerProps = {
  item: ItemRecord

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
      return <TimeItem value={values[0]} onValueChange={onValueChange} />

    case "timeRange":
      return <TimeRangeItem values={values} onValueChange={onValueChange} />

    case "audioPlayer":
      return <AudioPlayerItem item={item} />

    default:
      return <></>
  }
}
