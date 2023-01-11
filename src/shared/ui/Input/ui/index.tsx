import React from "react"

import classNames from "classnames"
import { Form } from "react-bootstrap"
import { useController, useFormContext } from "react-hook-form"

import { IInputCommonProps } from "../lib/interfaces"
import { InputIcon } from "./InputIcon"

import "./style.scss"

const Input = (props: IInputCommonProps) => {
  const { type, name, placeholder, onChange, className, Icon, onIconClick } = props

  const { control } = useFormContext()
  const {
    field: { onChange: onFormChange, value },
    fieldState: { error },
  } = useController({ name, control })

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (onChange) {
      onChange(value)
    }

    onFormChange(value)
  }

  return (
    <div className={classNames("input-with-icon-wrap")}>
      <Form.Control
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onInputChange}
        className={classNames("default-input", className, { "input-error-shadow": error })}
      />

      {Icon && onIconClick && (
        <InputIcon onClick={onIconClick}>
          <Icon />
        </InputIcon>
      )}

      <span className={classNames("input-error-box")}>{error && error.message}</span>
    </div>
  )
}

export default Input
