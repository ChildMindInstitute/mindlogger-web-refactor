import { t } from "i18next"

import { useCustomTranslation } from "~/utils/hooks/useCustomTranslation"

export interface UseNavbarTranslationOutput {
  t: typeof t
}

export const useNavbarTranslation = () => {
  const { t } = useCustomTranslation({ keyPrefix: "Navbar" })

  return { t }
}
