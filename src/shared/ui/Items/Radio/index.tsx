import { Form, Image } from "react-bootstrap"

import { CustomTooltip } from "../../Tooltip"

import "./style.scss"

type RadioItemOptionProps = {
  key: string

  id: string
  name: string
  value: string
  label: string

  description?: string
  image?: string
  disabled?: boolean
  defaultChecked?: boolean
  color?: string

  onChange: (value: string) => void
}

export const RadioItemOption = (props: RadioItemOptionProps) => {
  const { key, id, name, value, label, description, image, disabled, defaultChecked, color, onChange } = props

  return (
    <div key={key} className="response-option" style={{ background: color ? color : "none" }}>
      <div className="option-tooltip">{description && <CustomTooltip markdown={description} />}</div>

      {image && (
        <div className="option-image">
          <Image src={image} roundedCircle />
        </div>
      )}
      <Form.Check
        id={id}
        type="radio"
        name={name}
        className="form-check-width"
        value={value}
        label={label}
        disabled={disabled}
        defaultChecked={defaultChecked}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
