import { useMemo } from "react"

import { Col } from "react-bootstrap"

import { CheckboxItem as CheckboxItemType } from "../../lib/types/item"

import { CheckboxItemOption } from "~/shared/ui"
import { randomizeArray } from "~/shared/utils"

type CheckboxItemProps = {
  item: CheckboxItemType
  values: string[]

  onValueChange: (value: string[]) => void
  isDisabled: boolean
}

export const CheckboxItem = ({ item, values, onValueChange, isDisabled }: CheckboxItemProps) => {
  const options = useMemo(() => {
    if (item.config.randomizeOptions) {
      return randomizeArray(item.responseValues.options).filter(x => !x.isHidden)
    }

    return item.responseValues.options.filter(x => !x.isHidden)
  }, [item?.config?.randomizeOptions, item?.responseValues?.options])

  const leftColumnOptions = useMemo(() => {
    if (!options) {
      return []
    }

    return options.filter((option, index) => index < Math.ceil(options.length / 2))
  }, [options])

  const rightColumnOptions = useMemo(() => {
    if (!options) {
      return []
    }

    return options.filter((option, index) => index >= Math.ceil(options.length / 2))
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
    <>
      <Col md={6}>
        {leftColumnOptions.map(option => {
          return (
            <CheckboxItemOption
              key={option.id}
              id={option.id}
              name={item.id}
              value={option.text}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={values.includes(option.id)}
              color={option.color}
            />
          )
        })}
      </Col>

      <Col md={6}>
        {rightColumnOptions.map(option => {
          return (
            <CheckboxItemOption
              key={option.id}
              id={option.id}
              name={item.id}
              value={option.text}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={values.includes(option.id)}
              color={option.color}
            />
          )
        })}
      </Col>
    </>
  )
}
