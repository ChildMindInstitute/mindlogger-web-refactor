import { useTranslation } from "react-i18next"

import { UseTranslationOutput } from "./../types/useTranslationOutput"

export interface UseCustomTranslationProps {
  keyPrefix: string
}

export const useCustomTranslation = (props: UseCustomTranslationProps): UseTranslationOutput => {
  const { t, i18n } = useTranslation("translation", { keyPrefix: props.keyPrefix })

  return {
    i18n,
    t,
  }
}
