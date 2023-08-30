import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker"

type Props = {
  label?: string
  value?: string
  onChange: (value: Date | null) => void
}

export const TimeItemBase = ({ label, value, onChange }: Props) => {
  const formatedValue = value ? new Date(value) : null

  return (
    <DesktopTimePicker<Date>
      label={label}
      value={formatedValue}
      onChange={onChange}
      slotProps={{ textField: { placeholder: "HH:MM AM/PM" } }}
    />
  )
}
