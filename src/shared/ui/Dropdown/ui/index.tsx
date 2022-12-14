import { DropdownButton, Dropdown } from "react-bootstrap"

import { DropdownOptionList } from "../lib/interfaces"

export interface BaseDropdownProps {
  title: string
  onSelect: (value: string | null) => void
  options: DropdownOptionList
  beforeIndexDivider?: number
}

const BaseDropdown = ({ title, onSelect, options, beforeIndexDivider }: BaseDropdownProps) => {
  return (
    <DropdownButton align="end" title={title} onSelect={onSelect} className="text-center">
      {options?.map((option, index) => {
        const beforeThisElement = index === beforeIndexDivider

        return (
          <>
            {beforeIndexDivider && beforeThisElement && <Dropdown.Divider key={option.key} />}
            <Dropdown.Item key={option.key} eventKey={option.key}>
              {option.value}
            </Dropdown.Item>
          </>
        )
      })}
    </DropdownButton>
  )
}

export default BaseDropdown
