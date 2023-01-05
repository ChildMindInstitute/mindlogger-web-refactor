import { useCustomTranslation } from "~/shared/utils"

export const useProfileTranslation = () => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: "Profile" })

  return { t, i18n }
}
