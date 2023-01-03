import { useMemo } from "react"

import { Dropdown, DropdownOptionList } from "~/shared"

import { useNavbarTranslation } from "../lib/useNavbarTranslation"
import { useAccountDropdown } from "../lib/account-dropdown-options.constant"

export interface IAccountDropdownProps {
  title: string
  onSelectExtended?: () => void
}

const AccountDropdown = ({ title, onSelectExtended }: IAccountDropdownProps) => {
  const { t } = useNavbarTranslation()
  const { accountDropdownOptions } = useAccountDropdown()

  const onSelect = (buttonTag: string | null) => {
    const choosenOption = accountDropdownOptions.find(elementTag => elementTag.tag === buttonTag)

    if (onSelectExtended) {
      onSelectExtended()
    }

    return choosenOption?.onSelect()
  }

  const preparedAccountDropdownOptions: DropdownOptionList = useMemo(() => {
    return accountDropdownOptions.map(option => ({
      value: t(option.tag),
      key: option.tag,
    }))
  }, [t, accountDropdownOptions])

  return (
    <Dropdown
      title={title}
      options={preparedAccountDropdownOptions}
      onSelect={onSelect}
      beforeIndexDivider={preparedAccountDropdownOptions.length - 1}
    />
  )
}

export default AccountDropdown
