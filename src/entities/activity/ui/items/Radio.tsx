import { useMemo } from "react"

import { Col } from "react-bootstrap"

import { RadioItem as RadioItemType } from "../../lib"

import { RadioItemOption } from "~/shared/ui"
import { randomizeArray, splitList } from "~/shared/utils"

type RadioItemProps = {
  item: RadioItemType
  value: string

  onValueChange: (value: string[]) => void
  replaceText: (value: string) => string
  isDisabled: boolean
}

export const RadioItem = ({ item, value, onValueChange, isDisabled, replaceText }: RadioItemProps) => {
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
    onValueChange([value])
  }

  return (
    <>
      <Col md={6}>
        {evenColumn.map(option => {
          return (
            <RadioItemOption
              key={option.id}
              id={option.id}
              name={item.id}
              value={option.value}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={String(option.value) === value}
              color={option.color}
              replaceText={replaceText}
            />
          )
        })}
      </Col>

      <Col md={6}>
        {oddColumn.map(option => {
          return (
            <RadioItemOption
              key={option.id}
              id={option.id}
              name={item.id}
              value={option.value}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={String(option.value) === value}
              color={option.color}
              replaceText={replaceText}
            />
          )
        })}
      </Col>
    </>
  )
}
