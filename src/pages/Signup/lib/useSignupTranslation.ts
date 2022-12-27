import { useCustomTranslation } from "~/shared"

export const useSignupTranslation = () => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: "SignUp" })

  return { t, i18n }
}
