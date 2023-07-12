import { DatePicker } from "@mui/x-date-pickers/DatePicker"

type Props = {
  label?: string
  value?: string

  onChange: (value: string | null) => void
}

export const DateItemBase = (props: Props) => {
  return <DatePicker label={props.label} value={props.value} onChange={props.onChange} />
}
