import { i18n, t } from "i18next"
import { useTranslation } from "react-i18next"

export interface UseCustomTranslationOutput {
  i18n: i18n
  t: typeof t
}

export interface UseCustomTranslationProps {
  keyPrefix: string
}

export const useCustomTranslation = (props: UseCustomTranslationProps): UseCustomTranslationOutput => {
  const { t, i18n } = useTranslation("translation", { keyPrefix: props.keyPrefix })

  return {
    i18n,
    t,
  }
}
