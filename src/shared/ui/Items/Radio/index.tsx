import { useMemo } from "react"

import { Form, Image } from "react-bootstrap"

import { invertColor } from "../../../utils"
import { CustomTooltip } from "../../Tooltip"

import "./style.scss"

type RadioItemOptionProps = {
  id: string
  name: string
  value: string
  label: string

  description: string | null
  image: string | null
  disabled?: boolean
  defaultChecked?: boolean
  color: string | null

  onChange: (value: string) => void
  replaceText: (value: string) => string
}

export const RadioItemOption = (props: RadioItemOptionProps) => {
  const { id, name, value, label, description, image, disabled, defaultChecked, color, onChange, replaceText } = props

  const defaultOptionColor = "#333333"

  const tooltipText = useMemo(() => {
    if (description) {
      return replaceText(description)
    }

    return null
  }, [description, replaceText])

  const labelText = useMemo(() => {
    return replaceText(label)
  }, [replaceText, label])

  return (
    <div className="response-option" style={{ background: color ? color : "none" }}>
      {tooltipText ? <CustomTooltip markdown={tooltipText} /> : <div className="option-tooltip"></div>}

      {image ? <Image src={image} className="option-image" roundedCircle /> : <div className="option-image"></div>}
      <Form.Check
        id={id}
        type="radio"
        name={name}
        className="form-check-width"
        style={{ color: color ? invertColor(color) : defaultOptionColor }}
        value={value}
        label={labelText}
        disabled={disabled}
        defaultChecked={defaultChecked}
        onChange={e => onChange(e.target.id)}
      />
    </div>
  )
}
