import { Tokens } from "../lib"

import { securelocalStorageService } from "~/shared/utils"

const createSecureTokensStorage = () => {
  const name = "tokens"

  const setTokens = (data: Tokens) => {
    securelocalStorageService.setItem(name, data)
  }

  const getTokens = () => {
    return securelocalStorageService.getItem(name)
  }

  return { setTokens, getTokens }
}

export const secureTokensStorage = createSecureTokensStorage()
