import { useMemo } from "react"

import Box from "@mui/material/Box"

import { CheckboxItemOption } from "./CheckboxItemOption"
import { CheckboxItem as CheckboxItemType } from "../../../lib/types/item"

import { randomizeArray, splitList, useCustomMediaQuery } from "~/shared/utils"

type CheckboxItemProps = {
  item: CheckboxItemType
  values: string[]

  onValueChange: (value: string[]) => void
  replaceText: (value: string) => string
  isDisabled: boolean
}

export const CheckboxItem = ({ item, values, onValueChange, isDisabled, replaceText }: CheckboxItemProps) => {
  const { lessThanSM } = useCustomMediaQuery()

  const options = useMemo(() => {
    if (item.config.randomizeOptions) {
      return randomizeArray(item.responseValues.options).filter(x => !x.isHidden)
    }

    return item.responseValues.options.filter(x => !x.isHidden)
  }, [item?.config?.randomizeOptions, item?.responseValues?.options])

  const noneAboveOptionChecked = options.some(x => x.isNoneAbove && values.includes(String(x.value)))

  const [evenColumn, oddColumn] = useMemo(() => {
    return splitList(options)
  }, [options])

  const onHandleValueChange = (value: string, isNoneAbove: boolean) => {
    const preparedValues = [...values]

    const changedValueIndex = preparedValues.findIndex(x => x === value)
    const isChangedIndexExist = changedValueIndex !== -1

    if (isChangedIndexExist) {
      preparedValues.splice(changedValueIndex, 1)
    }

    if (noneAboveOptionChecked) {
      return onValueChange(preparedValues)
    }

    if (!isChangedIndexExist && !isNoneAbove) {
      preparedValues.push(value)
    }

    if (!isChangedIndexExist && isNoneAbove) {
      preparedValues.splice(0, preparedValues.length)
      preparedValues.push(value)
    }

    onValueChange(preparedValues)
  }

  return (
    <Box display="flex" flex={1} gap="16px" flexDirection={lessThanSM ? "column" : "row"}>
      <Box display="flex" flex={1} gap="16px" flexDirection="column">
        {evenColumn.map(option => {
          const isChecked = values.includes(String(option.value))
          const isNoneAbove = option.isNoneAbove

          const disabledDueNoneAbove = !isNoneAbove && noneAboveOptionChecked

          return (
            <CheckboxItemOption
              key={option.id}
              id={option.id}
              name={item.id}
              value={option.value}
              label={option.text}
              onChange={(value: string) => onHandleValueChange(value, isNoneAbove)}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled || disabledDueNoneAbove}
              defaultChecked={isChecked}
              color={option.color}
              replaceText={replaceText}
            />
          )
        })}
      </Box>

      <Box display="flex" flex={1} gap="16px" flexDirection="column">
        {oddColumn.map(option => {
          const isChecked = values.includes(String(option.value))
          const isNoneAbove = option.isNoneAbove

          const disabledDueNoneAbove = !isNoneAbove && noneAboveOptionChecked

          return (
            <CheckboxItemOption
              key={option.id}
              id={option.id}
              name={item.id}
              value={option.value}
              label={option.text}
              onChange={(value: string) => onHandleValueChange(value, isNoneAbove)}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled || disabledDueNoneAbove}
              defaultChecked={isChecked}
              color={option.color}
              replaceText={replaceText}
            />
          )
        })}
      </Box>
    </Box>
  )
}
