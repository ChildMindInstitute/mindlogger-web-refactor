import TextField from "@mui/material/TextField"

type AdditionalTextResponseProps = {
  value: string
  onValueChange: (value: string) => void
}

export const AdditionalTextResponse = ({ value, onValueChange }: AdditionalTextResponseProps) => {
  return (
    <TextField fullWidth size="small" value={value} onChange={e => onValueChange(e.target.value)} disabled={false} />
  )
}
