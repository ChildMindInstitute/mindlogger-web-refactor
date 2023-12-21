import { useCallback, useMemo, useState } from "react"

import { useLanguageList } from "../lib/useLanguageList"
import { useLanguageTranslation } from "../lib/useLanguageTranslation"

import { SupportableLanguage } from "~/app/system/locale/constants"
import { DropdownOptionList } from "~/shared/ui"
import BaseDropdown from "~/shared/ui/Dropdown"

type Props = {
  toggleMenuOpen: () => void
}

const LanguageDropdown = (props: Props) => {
  const { t, i18n } = useLanguageTranslation()
  const [language, setLanguage] = useState(i18n.language || SupportableLanguage.English)
  const preparedLanguageList = useLanguageList()

  const onSelect = useCallback(
    (lang: string | null) => {
      if (!lang) {
        return
      }

      props.toggleMenuOpen()

      setLanguage(lang)
      i18n.changeLanguage(lang)
    },
    [i18n, props],
  )

  const preparedLanguageOptions: DropdownOptionList = useMemo(() => {
    return preparedLanguageList.map(lang => ({ value: t(lang.localizationPath), key: lang.eventKey, onSelect }))
  }, [preparedLanguageList, t, onSelect])

  return (
    <div data-testid="header-language-dropdown">
      <BaseDropdown
        title={language === SupportableLanguage.English ? t("english") : t("french")}
        options={preparedLanguageOptions}
      />
    </div>
  )
}

export default LanguageDropdown
