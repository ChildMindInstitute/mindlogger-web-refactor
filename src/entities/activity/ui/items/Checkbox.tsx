import { Col } from "react-bootstrap"

import { CheckboxItem as CheckboxItemType } from "../../lib/types/item"

import { CheckboxItemOption } from "~/shared/ui"

type CheckboxItemProps = {
  item: CheckboxItemType
  values: string[]

  onValueChange: (value: string[]) => void
  isDisabled: boolean
}

export const CheckboxItem = ({ item, values, onValueChange, isDisabled }: CheckboxItemProps) => {
  const options = item.responseValues.options.filter(x => !x.isHidden)

  const leftColumnOptions = options.filter((option, index) => index < Math.ceil(options.length / 2))
  const rightColumnOptions = options.filter((option, index) => index >= Math.ceil(options.length / 2))

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
              name={item.name}
              value={option.text}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={values.includes(option.id)}
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
              name={item.name}
              value={option.text}
              label={option.text}
              onChange={onHandleValueChange}
              description={option.tooltip}
              image={option.image}
              disabled={isDisabled}
              defaultChecked={values.includes(option.id)}
            />
          )
        })}
      </Col>
    </>
  )
}
