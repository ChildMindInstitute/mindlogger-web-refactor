import { useMemo, useState } from "react"

import { SupportableLanguage } from "../../../app/system/locale/constants"

import BaseDropdown, { DropdownOptionList } from "../../../shared/Dropdown"
import { useCustomTranslation } from "../../../utils/hooks/useCustomTranslation"
import { languageList } from "../lib/language-list"

export interface LanguageDropdownProps {
  onSelectExtended: () => void
}

const LanguageDropdown = ({ onSelectExtended }: LanguageDropdownProps) => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: "Navbar" })
  const [language, setLanguage] = useState(i18n.language || SupportableLanguage.English)

  const onSelectHandler = (lang: string | null) => {
    if (!lang) {
      return
    }

    setLanguage(lang)
    i18n.changeLanguage(lang)
    onSelectExtended()
  }

  const preparedLanguageOptions: DropdownOptionList = useMemo(() => {
    return languageList.map(lang => ({ value: t(lang.localizeTitlePath), eventKey: lang.eventKey }))
  }, [t])

  return (
    <BaseDropdown
      title={language === SupportableLanguage.English ? t("english") : t("french")}
      options={preparedLanguageOptions}
      onSelect={onSelectHandler}
    />
  )
}

export default LanguageDropdown
