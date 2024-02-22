import { useCustomTranslation } from "~/shared/utils"

export const useNavbarTranslation = () => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: "Navbar" })

  return { t, i18n }
}
