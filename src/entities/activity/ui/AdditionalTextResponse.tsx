import TextField from "@mui/material/TextField"

type AdditionalTextResponseProps = {
  value: string
  onValueChange: (value: string) => void
}

export const AdditionalTextResponse = ({ value, onValueChange }: AdditionalTextResponseProps) => {
  const onHandleValueChange = (value: string) => {
    if (value.length === 0) {
      return onValueChange("")
    }

    return onValueChange(value)
  }

  return (
    <TextField
      fullWidth
      size="small"
      value={value}
      onChange={e => onHandleValueChange(e.target.value)}
      disabled={false}
    />
  )
}
