import { i18n, t } from "i18next"

import { useCustomTranslation } from "~/shared/utils"

export interface UseLanguageTranslationOutput {
  t: typeof t
  i18n: i18n
}

export const useLanguageTranslation = () => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: "Language" })

  return { t, i18n }
}
