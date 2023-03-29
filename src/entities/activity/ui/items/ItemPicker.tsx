import { ActivityEventProgressRecord } from "../../model/types"
import { CheckboxItem } from "./Checkbox"
import { TextItem } from "./Text"

type ItemPickerProps = {
  item: ActivityEventProgressRecord

  value: string
  onValueChange: (value: string) => void
  isDisabled: boolean
}

export const ItemPicker = ({ item, value, onValueChange, isDisabled }: ItemPickerProps) => {
  switch (item.responseType) {
    case "text":
      return <TextItem value={value} onValueChange={onValueChange} isDisabled={isDisabled} />

    case "multiSelect":
      return <CheckboxItem item={item} onValueChange={onValueChange} isDisabled={isDisabled} />

    default:
      return <></>
  }
}
