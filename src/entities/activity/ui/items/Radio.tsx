import { Col } from "react-bootstrap"

import { RadioItem as RadioItemType } from "../../lib"

import { RadioItemOption } from "~/shared/ui"

type RadioItemProps = {
  item: RadioItemType
  value: string

  onValueChange: (value: string[]) => void
  isDisabled: boolean
}

export const RadioItem = ({ item, value, onValueChange, isDisabled }: RadioItemProps) => {
  const options = item.responseValues.options.filter(x => !x.isHidden)

  const leftColumnOptions = options.filter((option, index) => index < Math.ceil(options.length / 2))
  const rightColumnOptions = options.filter((option, index) => index >= Math.ceil(options.length / 2))

  const onHandleValueChange = (value: string) => {
    onValueChange([value])
  }

  return (
    <>
      <Col md={6}>
        {leftColumnOptions.map(option => {
          return (
            <RadioItemOption
              key={option.id}
              id={option.id}
              name={item.name}
              value={option.text}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={option.id === value}
            />
          )
        })}
      </Col>

      <Col md={6}>
        {rightColumnOptions.map(option => {
          return (
            <RadioItemOption
              key={option.id}
              id={option.id}
              name={item.name}
              value={option.text}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={option.id === value}
            />
          )
        })}
      </Col>
    </>
  )
}
