import { DropdownButton, Dropdown } from "react-bootstrap"

import { DropdownOptionList } from "../lib/interfaces"

export interface BaseDropdownProps {
  title: string
  onSelect: (value: string | null) => void
  options: DropdownOptionList
}

const BaseDropdown = ({ title, onSelect, options }: BaseDropdownProps) => {
  return (
    <DropdownButton align="end" title={title} onSelect={onSelect} className="text-center">
      {options?.map(option => (
        <Dropdown.Item key={option.eventKey} eventKey={option.eventKey}>
          {option.value}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
}

export default BaseDropdown
