import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import enResource from "../i18n/en/resources.json"
import frResource from "../i18n/fr/resources.json"
import deResource from "../i18n/de/resources.json"

const i18nManager = {
  initialize() {
    i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: "en",
        resources: {
          en: enResource,
          fr: frResource,
          de: deResource,
        },
        ns: ["common"],
        defaultNS: "common",
        interpolation: {
          escapeValue: false,
        },
        debug: process.env.NODE_ENV !== "production",
      })
  },
}

export default i18nManager
