import { DateItemBase } from "~/shared/ui"

type Props = {
  value?: string

  onValueChange: (value: string[]) => void
}

export const DateItem = ({ value, onValueChange }: Props) => {
  const onHandleChange = (value: string) => {
    return onValueChange([value])
  }

  return <DateItemBase value={value} onChange={onHandleChange} />
}
