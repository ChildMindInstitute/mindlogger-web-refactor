import { useCustomTranslation } from "~/utils/hooks/useCustomTranslation"
import { UseTranslationOutput } from "~/utils/types/useTranslationOutput"

export const useNavbarTranslation = (): UseTranslationOutput => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: "Navbar" })

  return { t, i18n }
}
