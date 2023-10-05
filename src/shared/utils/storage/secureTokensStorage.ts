import { Tokens } from "~/entities/user/lib"
import { eventEmitter, secureSessionStorageService } from "~/shared/utils"

const createSecureTokensStorage = () => {
  const name = "tokens"

  const setTokens = (data: Tokens) => {
    secureSessionStorageService.setItem(name, data)
    eventEmitter.emit("onTokensChange")
  }

  const getTokens = () => {
    return secureSessionStorageService.getItem(name) as Tokens | null
  }

  const clearTokens = () => {
    secureSessionStorageService.removeItem(name)
    eventEmitter.emit("onTokensChange")
  }

  return { setTokens, getTokens, clearTokens }
}

export const secureTokensStorage = createSecureTokensStorage()
