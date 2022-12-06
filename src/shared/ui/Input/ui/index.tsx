import React from "react"
import classNames from "classnames"
import { useController, useFormContext } from "react-hook-form"
import { Form } from "react-bootstrap"

import { IInputCommonProps } from "../lib/interfaces"

const Input = (props: IInputCommonProps) => {
  const { type, name, placeholder, onChange, className } = props

  const { control } = useFormContext()
  const {
    field: { onChange: onFormChange, value },
  } = useController({ name, control })

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (onChange) {
      onChange(value)
    }

    onFormChange(value)
  }

  return (
    <Form.Control
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onInputChange}
      className={classNames("mb-3", className)}
    />
  )
}

export default Input
