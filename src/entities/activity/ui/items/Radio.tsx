import { useMemo } from "react"

import { Col } from "react-bootstrap"

import { RadioItem as RadioItemType } from "../../lib"

import { RadioItemOption } from "~/shared/ui"
import { randomizeArray } from "~/shared/utils"

type RadioItemProps = {
  item: RadioItemType
  value: string

  onValueChange: (value: string[]) => void
  isDisabled: boolean
}

export const RadioItem = ({ item, value, onValueChange, isDisabled }: RadioItemProps) => {
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
    onValueChange([value])
  }

  return (
    <>
      <Col md={6}>
        {leftColumnOptions?.map(option => {
          return (
            <RadioItemOption
              key={option.id}
              id={option.id}
              name={item.id}
              value={option.text}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={option.id === value}
              color={option.color}
            />
          )
        })}
      </Col>

      <Col md={6}>
        {rightColumnOptions?.map(option => {
          return (
            <RadioItemOption
              key={option.id}
              id={option.id}
              name={item.id}
              value={option.text}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={option.id === value}
              color={option.color}
            />
          )
        })}
      </Col>
    </>
  )
}
