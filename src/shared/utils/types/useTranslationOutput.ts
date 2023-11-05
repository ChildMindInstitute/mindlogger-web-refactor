import { i18n, t } from "i18next"

import { Language } from "./multilang"

export interface UseTranslationOutput {
  i18n: i18n
  t: typeof t
  language: Language
}
