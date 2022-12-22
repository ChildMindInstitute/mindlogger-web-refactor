import { SupportableLanguage } from "~/app/system/locale/constants"
import { enumToArray } from "~/shared/utils/enumToArray"

export interface ILanguageListItem {
  localizationPath: string
  eventKey: SupportableLanguage
}

export type LanguageList = ILanguageListItem[]

export const useLanguageList = (): LanguageList => {
  const preparedLanguageList = enumToArray(SupportableLanguage).map(lang => ({
    localizationPath: lang.key.toLocaleLowerCase(), // Enum keys should be equal list of keys in localizations file, because enum key = localization path
    eventKey: lang.value,
  }))

  return preparedLanguageList
}
