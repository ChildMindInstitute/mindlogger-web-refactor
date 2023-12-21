export interface DropdownOption {
  key: string
  value: string
  onSelect: (value: string) => void
}

export type DropdownOptionList = DropdownOption[]
