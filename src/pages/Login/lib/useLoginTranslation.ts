import { useCustomTranslation } from "~/shared"

export const useLoginTranslation = () => {
  const { t } = useCustomTranslation({ keyPrefix: "Login" })

  return { t }
}
