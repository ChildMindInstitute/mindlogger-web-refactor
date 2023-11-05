import { useTranslation } from "react-i18next"

import { Language } from "../types"
import { UseTranslationOutput } from "../types/useTranslationOutput"

export interface UseCustomTranslationProps {
  keyPrefix: string
}

export const useCustomTranslation = (props?: UseCustomTranslationProps): UseTranslationOutput => {
  const { t, i18n } = useTranslation("translation", { keyPrefix: props?.keyPrefix })

  return {
    language: i18n.language as Language,
    i18n,
    t,
  }
}
