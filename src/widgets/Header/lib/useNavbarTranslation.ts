import { UseTranslationOutput, useCustomTranslation } from "~/shared/utils"

export const useNavbarTranslation = (): UseTranslationOutput => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: "Navbar" })

  return { t, i18n }
}
