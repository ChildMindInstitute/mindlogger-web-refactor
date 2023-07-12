import { FormControl } from "react-bootstrap"

type Props = {
  value?: string

  onChange: (value: string) => void
}

export const DateItemBase = (props: Props) => {
  return <FormControl type="date" value={props.value} onChange={e => props.onChange(e.target.value)} />
}
