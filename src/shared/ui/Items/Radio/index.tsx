import { Form, Image } from "react-bootstrap"

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
  color?: string

  onChange: (value: string) => void
}

export const RadioItemOption = (props: RadioItemOptionProps) => {
  const { id, name, value, label, description, image, disabled, defaultChecked, color, onChange } = props

  return (
    <div className="response-option" style={{ background: color ? color : "none" }}>
      {description ? <CustomTooltip markdown={description} /> : <div className="option-tooltip"></div>}

      {image ? <Image src={image} className="option-image" roundedCircle /> : <div className="option-image"></div>}
      <Form.Check
        id={id}
        type="radio"
        name={name}
        className="form-check-width"
        value={value}
        label={label}
        disabled={disabled}
        defaultChecked={defaultChecked}
        onChange={e => onChange(e.target.id)}
      />
    </div>
  )
}
