import { PropsWithChildren } from "react"

import classNames from "classnames"
import { Form } from "react-bootstrap"

export interface CheckboxWithLabelProps extends PropsWithChildren {
  value?: string | number | string[]
  onChange: () => void
  uniqId: string
  classNameBox?: string
  classNameLabel?: string
  checked?: boolean
}

const CheckboxWithLabel = ({
  onChange,
  value,
  uniqId,
  children,
  classNameBox,
  classNameLabel,
  checked,
}: CheckboxWithLabelProps) => {
  return (
    <Form.Check className={classNames("cursor-pointer")}>
      <Form.Check.Input
        id={uniqId}
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
        className={classNames("mr-1", "hover-pointer", classNameBox)}
      />
      <Form.Check.Label htmlFor={uniqId} className={classNames("hover-pointer", classNameLabel)}>
        {children}
      </Form.Check.Label>
    </Form.Check>
  )
}

export default CheckboxWithLabel
