import { useMemo } from "react"

import { useAccountDropdown } from "../lib/account-dropdown-options.constant"
import { useNavbarTranslation } from "../lib/useNavbarTranslation"

import { Dropdown, DropdownOptionList } from "~/shared/ui"

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
    <div data-testid="header-user-account-dropdown">
      <Dropdown
        title={title}
        options={preparedAccountDropdownOptions}
        onSelect={onSelect}
        beforeIndexDivider={preparedAccountDropdownOptions.length - 1}
      />
    </div>
  )
}

export default AccountDropdown
