import { secureSessionStorageService } from "~/shared/utils"

const createSecureUserPrivateKeyStorage = () => {
  const name = "userPrivateKey"

  const setUserPrivateKey = (userPrivateKey: number[]) => {
    secureSessionStorageService.setItem(name, userPrivateKey)
  }

  const getUserPrivateKey = () => {
    return secureSessionStorageService.getItem(name) as number[] | null
  }

  const clearUserPrivateKey = () => {
    secureSessionStorageService.removeItem(name)
  }

  return { setUserPrivateKey, getUserPrivateKey, clearUserPrivateKey }
}

export const secureUserPrivateKeyStorage = createSecureUserPrivateKeyStorage()
