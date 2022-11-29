import { useCustomTranslation } from "../../../utils/hooks/useCustomTranslation"

export const useLoginTranslation = () => {
  const { t } = useCustomTranslation({ keyPrefix: "Login" })

  return { t }
}
