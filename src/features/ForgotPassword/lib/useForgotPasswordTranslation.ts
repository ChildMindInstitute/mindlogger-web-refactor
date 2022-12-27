import { useCustomTranslation } from "~/shared"

export const useForgotPasswordTranslation = () => {
  const { t, i18n } = useCustomTranslation({ keyPrefix: "ForgotPassword" })

  return { t, i18n }
}
