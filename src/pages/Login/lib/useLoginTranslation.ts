import { useCustomTranslation } from "~/shared/utils/hooks/useCustomTranslation"

export const useLoginTranslation = () => {
  const { t } = useCustomTranslation({ keyPrefix: "Login" })

  return { t }
}
