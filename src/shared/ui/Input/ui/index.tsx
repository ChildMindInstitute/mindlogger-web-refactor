import React, { useMemo, useState } from "react"
import classNames from "classnames"
import { useController, useFormContext } from "react-hook-form"
import { Form } from "react-bootstrap"

import { InputIcon } from "./InputIcon"
import { IInputCommonProps } from "../lib/interfaces"

import "./style.scss"
import { Eye, EyeSlash } from "react-bootstrap-icons"

const Input = (props: IInputCommonProps) => {
  const { type, name, placeholder, onChange, className } = props

  const isPasswordInput = useMemo(() => type === "password", [type])

  const [isPasswordType, setIsPasswordType] = useState<"password" | "text" | null>(isPasswordInput ? "password" : null)

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

  const onIconClick = () => {
    if (isPasswordType === "password") {
      setIsPasswordType("text")
    } else {
      setIsPasswordType("password")
    }
  }

  return (
    <div className={classNames("input-with-icon-wrap")}>
      <Form.Control
        type={isPasswordType ? isPasswordType : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onInputChange}
        className={classNames("default-input", className, { "input-error-shadow": error })}
      />

      {isPasswordInput && isPasswordType === "password" && (
        <InputIcon onClick={onIconClick}>
          <EyeSlash width={20} height={16} />
        </InputIcon>
      )}

      {isPasswordInput && isPasswordType === "text" && (
        <InputIcon onClick={onIconClick}>
          <Eye width={20} height={16} />
        </InputIcon>
      )}

      <span className={classNames("input-error-box")}>{error && error.message}</span>
    </div>
  )
}

export default Input
