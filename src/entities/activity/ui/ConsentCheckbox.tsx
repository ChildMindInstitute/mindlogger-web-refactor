import classNames from "classnames"
import { Form } from "react-bootstrap"

type Props = {
  id: string
  value: boolean
  label: JSX.Element
  onChange: (value: boolean) => void

  className?: string
}

export const ConsentCheckbox = ({ id, value, label, onChange, className }: Props) => {
  return (
    <div className={classNames("d-flex", className)}>
      <Form.Check.Input id={id} type="checkbox" checked={value} onChange={() => onChange(!value)} className="mx-1" />
      {label}
    </div>
  )
}
