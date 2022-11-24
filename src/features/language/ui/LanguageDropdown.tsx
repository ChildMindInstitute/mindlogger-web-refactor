import { useMemo, useState } from "react"

import { SupportableLanguage } from "../../../app/system/locale/constants"
import { useLanguageList } from "../lib/useLanguageList"
import { useLanguageTranslation } from "../lib/useLanguageTranslation"

import BaseDropdown, { DropdownOptionList } from "../../../shared/Dropdown"

export interface LanguageDropdownProps {
  onSelectExtended?: () => void
}

const LanguageDropdown = ({ onSelectExtended }: LanguageDropdownProps) => {
  const { t, i18n } = useLanguageTranslation()
  const [language, setLanguage] = useState(i18n.language || SupportableLanguage.English)
  const { preparedLanguageList } = useLanguageList()

  const onSelectHandler = (lang: string | null) => {
    if (!lang) {
      return
    }

    setLanguage(lang)
    i18n.changeLanguage(lang)

    if (onSelectExtended) {
      onSelectExtended()
    }
  }

  const preparedLanguageOptions: DropdownOptionList = useMemo(() => {
    return preparedLanguageList.map(lang => ({ value: t(lang.localizationPath), eventKey: lang.eventKey }))
  }, [t, preparedLanguageList])

  return (
    <BaseDropdown
      title={language === SupportableLanguage.English ? t("english") : t("french")}
      options={preparedLanguageOptions}
      onSelect={onSelectHandler}
    />
  )
}

export default LanguageDropdown
