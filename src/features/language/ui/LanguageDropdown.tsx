import { useMemo, useState } from "react"

import { SupportableLanguage } from "~/app/system/locale/constants"
import { DropdownOptionList, Dropdown } from "~/shared/ui"

import { useLanguageList } from "../lib/useLanguageList"
import { useLanguageTranslation } from "../lib/useLanguageTranslation"

export interface LanguageDropdownProps {
  onSelectExtended?: () => void
}

const LanguageDropdown = ({ onSelectExtended }: LanguageDropdownProps) => {
  const { t, i18n } = useLanguageTranslation()
  const [language, setLanguage] = useState(i18n.language || SupportableLanguage.English)
  const preparedLanguageList = useLanguageList()

  const onSelect = (lang: string | null) => {
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
    return preparedLanguageList.map(lang => ({ value: t(lang.localizationPath), key: lang.eventKey }))
  }, [t, preparedLanguageList])

  return (
    <Dropdown
      title={language === SupportableLanguage.English ? t("english") : t("french")}
      options={preparedLanguageOptions}
      onSelect={onSelect}
    />
  )
}

export default LanguageDropdown
