import { TextItem as TextItemType } from "../../lib"

import { TextItem as BaseTextItem } from "~/shared/ui"
import { stringContainsOnlyNumbers } from "~/shared/utils"

type TextItemProps = {
  item: TextItemType
  value: string
  onValueChange: (value: string[]) => void
  isDisabled: boolean
}

export const TextItem = ({ item, value, onValueChange, isDisabled }: TextItemProps) => {
  const { maxResponseLength, numericalResponseRequired } = item.config

  const onHandleValueChange = (value: string) => {
    if (value.length > maxResponseLength) {
      return
    }

    if (value.length === 0) {
      return onValueChange([])
    }

    if (numericalResponseRequired && !stringContainsOnlyNumbers(value)) {
      return
    }

    return onValueChange([value])
  }

  return <BaseTextItem value={value} onValueChange={onHandleValueChange} disabled={isDisabled} />
}
