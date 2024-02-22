import { useMemo } from "react"

import { SelectorItem as SelectorItemType } from "../../lib"

import { SelectorItem as SelectorItemBase } from "~/shared/ui"
import { ValueLabel } from "~/shared/utils"

type SelectorItemProps = {
  item: SelectorItemType
  value: string

  onValueChange: (value: string[]) => void
  isDisabled: boolean
}

export const SelectorItem = ({ item, value, onValueChange, isDisabled }: SelectorItemProps) => {
  const { minValue, maxValue } = item.responseValues

  const valueLabelList = useMemo(() => {
    const list: Array<ValueLabel> = []

    for (let i = minValue; i <= maxValue; i++) {
      list.push({
        value: i,
        label: i,
      })
    }

    return list
  }, [maxValue, minValue])

  const onHandleValueChange = (value: string) => {
    onValueChange([value])
  }

  return (
    <SelectorItemBase
      value={value}
      valueLabelList={valueLabelList}
      onValueChange={onHandleValueChange}
      disabled={isDisabled}
    />
  )
}
