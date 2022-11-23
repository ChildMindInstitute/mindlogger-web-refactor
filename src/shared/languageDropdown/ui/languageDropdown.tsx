import React, { useState } from "react"
import { DropdownButton, Dropdown } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { SupportableLanguage } from "../../../app/system/locale/constants"

import { languageList } from "../constants/language-list"

interface LanguageDropdownProps {
  closeExpandedNavbar: () => void
}

const LanguageDropdown = ({ closeExpandedNavbar }: LanguageDropdownProps): JSX.Element | null => {
  const { t, i18n } = useTranslation("translation", { keyPrefix: "Navbar" })
  const [language, setLanguage] = useState(i18n.language || SupportableLanguage.English)

  const onSelectHandler = (lang: string | null) => {
    if (!lang) {
      return
    }

    setLanguage(lang)
    i18n.changeLanguage(lang)
    closeExpandedNavbar()
  }

  return (
    <DropdownButton
      align="end"
      title={language === SupportableLanguage.English ? t("english") : t("french")}
      onSelect={onSelectHandler}
      className="text-center">
      {languageList?.map(lang => (
        <Dropdown.Item key={lang.eventKey} eventKey={lang.eventKey}>
          {t(lang.localizeTitlePath)}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  )
}

export default LanguageDropdown
