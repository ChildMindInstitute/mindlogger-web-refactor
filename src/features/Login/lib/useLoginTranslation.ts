import { useCustomTranslation } from "~/shared/utils"

export const useLoginTranslation = () => {
  const { t } = useCustomTranslation({ keyPrefix: "Login" })

  return { t }
}
