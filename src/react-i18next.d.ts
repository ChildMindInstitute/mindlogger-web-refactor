import "react-i18next"
import en from "./i18n/en/translation.json"

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation"
    resources: typeof en
  }
}
