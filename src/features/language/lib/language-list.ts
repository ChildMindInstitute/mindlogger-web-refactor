import { SupportableLanguage } from "../../../app/system/locale/constants"

export interface ILanguageListItem {
  localizeTitlePath: string
  eventKey: SupportableLanguage
}

export type LanguageList = ILanguageListItem[]

export const languageList: LanguageList = [
  {
    localizeTitlePath: "english",
    eventKey: SupportableLanguage.English,
  },
  {
    localizeTitlePath: "french",
    eventKey: SupportableLanguage.French,
  },
]
