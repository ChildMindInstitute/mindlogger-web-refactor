import { ActivityEventProgressRecord } from "../../model/types"
import { CheckboxItem } from "./Checkbox"
import { RadioItem } from "./Radio"
import { TextItem } from "./Text"

type ItemPickerProps = {
  item: ActivityEventProgressRecord

  values: string[]
  onValueChange: (value: string) => void
  isDisabled: boolean
}

export const ItemPicker = ({ item, values, onValueChange, isDisabled }: ItemPickerProps) => {
  switch (item.responseType) {
    case "text":
      return <TextItem value={values[0]} onValueChange={onValueChange} isDisabled={isDisabled} />

    case "multiSelect":
      return <CheckboxItem item={item} values={values} onValueChange={onValueChange} isDisabled={isDisabled} />

    case "singleSelect":
      return <RadioItem item={item} onValueChange={onValueChange} isDisabled={isDisabled} />

    default:
      return <></>
  }
}
