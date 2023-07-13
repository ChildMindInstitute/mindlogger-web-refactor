import { TimePicker } from "@mui/x-date-pickers/TimePicker"

type Props = {
  label?: string
  value?: string
  onChange: (value: Date | null) => void
}

export const TimeItemBase = ({ label, value, onChange }: Props) => {
  const formatedValue = value ? new Date(value) : null

  return <TimePicker<Date> label={label} value={formatedValue} onChange={onChange} />
}
