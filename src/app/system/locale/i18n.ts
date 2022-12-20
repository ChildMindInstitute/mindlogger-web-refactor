import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import enResources from "../../../i18n/en/translation.json"
import frResources from "../../../i18n/fr/translation.json"

const i18nManager = {
  initialize() {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: "en",
        resources: {
          en: enResources,
          fr: frResources,
        },
        supportedLngs: ["en", "fr"],
        interpolation: {
          escapeValue: false,
        },
        debug: import.meta.env.NODE_ENV !== "production",
      })
  },

  addResources(language: string, namespace: string, resources: Record<string, string>) {
    i18n.addResources(language, namespace, resources)
  },
}

export default i18nManager
