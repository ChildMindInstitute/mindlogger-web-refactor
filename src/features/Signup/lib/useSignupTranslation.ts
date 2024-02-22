import { useCustomTranslation } from "~/shared/utils"

export const useSignupTranslation = () => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: "SignUp" })

  return { t, i18n }
}
