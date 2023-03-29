import { Col } from "react-bootstrap"

import { ActivityEventProgressRecord } from "../../model/types"

import { RadioItemOption } from "~/shared/ui"

type RadioItemProps = {
  item: ActivityEventProgressRecord

  onValueChange: (value: string) => void
  isDisabled: boolean
}

export const RadioItem = ({ item, onValueChange, isDisabled }: RadioItemProps) => {
  const options = item.responseValues!.options.filter(x => !x.isHidden)

  const leftColumnOptions = options.filter((option, index) => index < Math.ceil(options.length / 2))
  const rightColumnOptions = options.filter((option, index) => index >= Math.ceil(options.length / 2))

  return (
    <>
      <Col md={6}>
        {leftColumnOptions.map((option, index) => {
          return (
            <RadioItemOption
              key={`${index}${option.text}`}
              id={option.text}
              name={option.text}
              value={option.text}
              label={option.text}
              onChange={onValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
            />
          )
        })}
      </Col>

      <Col md={6}>
        {rightColumnOptions.map((option, index) => {
          return (
            <RadioItemOption
              key={`${index}${option.text}`}
              id={option.text}
              name={option.text}
              value={option.text}
              label={option.text}
              onChange={onValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
            />
          )
        })}
      </Col>
    </>
  )
}
