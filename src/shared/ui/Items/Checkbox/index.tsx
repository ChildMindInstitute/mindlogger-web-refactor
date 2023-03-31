import { Form, Image } from "react-bootstrap"

import { CustomTooltip } from "../../Tooltip"

import "./style.scss"

type CheckboxItemOptionProps = {
  key: string

  id: string
  name: string
  value: string
  label: string

  disabled?: boolean
  image: string | null
  description: string | null
  color?: string
  defaultChecked?: boolean

  onChange: (value: string) => void
}

export const CheckboxItemOption = (props: CheckboxItemOptionProps) => {
  const { id, key, name, value, label, image, description, disabled, defaultChecked, onChange, color } = props

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
        type="checkbox"
        name={name}
        className="form-check-width"
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
