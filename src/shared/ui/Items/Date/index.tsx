import { DatePicker } from "@mui/x-date-pickers/DatePicker"

type Props = {
  label?: string
  value: Date | null

  onChange: (value: Date | null) => void
}

export const DateItemBase = ({ label, value, onChange }: Props) => {
  return <DatePicker<Date> label={label} value={value ?? null} onChange={onChange} />
}
