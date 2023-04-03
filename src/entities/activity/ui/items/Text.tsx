import { TextItem as BaseTextItem } from "~/shared/ui"

type TextItemProps = {
  value: string
  onValueChange: (value: string[]) => void
  isDisabled: boolean
}

export const TextItem = ({ value, onValueChange, isDisabled }: TextItemProps) => {
  const onHandleValueChange = (value: string) => {
    onValueChange([value])
  }

  return <BaseTextItem value={value} onValueChange={onHandleValueChange} disabled={isDisabled} />
}
