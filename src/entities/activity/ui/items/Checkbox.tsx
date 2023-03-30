import { Col } from "react-bootstrap"

import { CheckboxItem as CheckboxItemType } from "../../lib/types/item"

import { CheckboxItemOption } from "~/shared/ui"

type CheckboxItemProps = {
  item: CheckboxItemType

  onValueChange: (value: string) => void
  isDisabled: boolean
}

export const CheckboxItem = ({ item, onValueChange, isDisabled }: CheckboxItemProps) => {
  const options = item.responseValues.options.filter(x => !x.isHidden)

  const leftColumnOptions = options.filter((option, index) => index < Math.ceil(options.length / 2))
  const rightColumnOptions = options.filter((option, index) => index >= Math.ceil(options.length / 2))

  return (
    <>
      <Col md={6}>
        {leftColumnOptions.map((option, index) => {
          return (
            <CheckboxItemOption
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
            <CheckboxItemOption
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
