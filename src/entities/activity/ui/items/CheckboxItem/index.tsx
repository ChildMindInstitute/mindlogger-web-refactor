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

  const [evenColumn, oddColumn] = useMemo(() => {
    return splitList(options)
  }, [options])

  const onHandleValueChange = (value: string) => {
    const preparedValues = [...values]

    const isCheckedValueIndexExist = preparedValues.findIndex(x => x === value)

    if (isCheckedValueIndexExist !== -1) {
      preparedValues.splice(isCheckedValueIndexExist, 1)
    } else {
      preparedValues.push(value)
    }

    onValueChange(preparedValues)
  }

  return (
    <Box display="flex" flex={1} gap="16px" flexDirection={lessThanSM ? "column" : "row"}>
      <Box display="flex" flex={1} gap="16px" flexDirection="column">
        {evenColumn.map(option => {
          return (
            <CheckboxItemOption
              key={option.id}
              id={option.id}
              name={item.id}
              value={option.value}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={values.includes(String(option.value))}
              color={option.color}
              replaceText={replaceText}
            />
          )
        })}
      </Box>

      <Box display="flex" flex={1} gap="16px" flexDirection="column">
        {oddColumn.map(option => {
          return (
            <CheckboxItemOption
              key={option.id}
              id={option.id}
              name={item.id}
              value={option.value}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={values.includes(String(option.value))}
              color={option.color}
              replaceText={replaceText}
            />
          )
        })}
      </Box>
    </Box>
  )
}
