import { useCustomTranslation } from "~/shared/utils"

export const useDownloadMobileTranslation = () => {
  const { t, i18n } = useCustomTranslation()

  return { t, i18n }
}
