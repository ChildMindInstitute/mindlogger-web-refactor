import { DatePicker } from "@mui/x-date-pickers/DatePicker"

type Props = {
  label?: string
  value?: string

  onChange: (value: string | null) => void
}

export const DateItemBase = ({ label, value, onChange }: Props) => {
  return <DatePicker label={label} value={value ?? null} onChange={onChange} />
}
