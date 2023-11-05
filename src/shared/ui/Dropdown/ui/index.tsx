import React from "react"

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
          <React.Fragment key={option.key}>
            {beforeIndexDivider && beforeThisElement && <Dropdown.Divider />}
            <Dropdown.Item key={option.key} eventKey={option.key}>
              {option.value}
            </Dropdown.Item>
          </React.Fragment>
        )
      })}
    </DropdownButton>
  )
}

export default BaseDropdown
