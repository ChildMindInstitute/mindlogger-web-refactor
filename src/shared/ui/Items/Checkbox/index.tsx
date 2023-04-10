import { Form, Image } from "react-bootstrap"

import { invertColor } from "../../../utils"
import { CustomTooltip } from "../../Tooltip"

import "./style.scss"

type CheckboxItemOptionProps = {
  id: string
  name: string
  value: string
  label: string

  disabled?: boolean
  image: string | null
  description: string | null
  color: string | null
  defaultChecked?: boolean

  onChange: (value: string) => void
}

export const CheckboxItemOption = (props: CheckboxItemOptionProps) => {
  const { id, name, value, label, image, description, disabled, defaultChecked, onChange, color } = props

  const defaultOptionColor = "#333333"

  return (
    <div className="response-option" style={{ background: color ? color : "none" }}>
      {description ? <CustomTooltip markdown={description} /> : <div className="option-tooltip"></div>}

      {image ? <Image src={image} className="option-image" roundedCircle /> : <div className="option-image"></div>}
      <Form.Check
        id={id}
        type="checkbox"
        name={name}
        className="form-check-width"
        style={{ color: color ? invertColor(color) : defaultOptionColor }}
        value={value}
        label={label}
        disabled={disabled}
        defaultChecked={defaultChecked}
        onChange={e => {
          onChange(e.target.id)
        }}
      />
    </div>
  )
}
