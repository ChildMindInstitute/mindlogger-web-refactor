import { useCustomTranslation } from "~/shared/utils/hooks/useCustomTranslation"
import { UseTranslationOutput } from "~/shared/utils/types/useTranslationOutput"

export const useNavbarTranslation = (): UseTranslationOutput => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: "Navbar" })

  return { t, i18n }
}
