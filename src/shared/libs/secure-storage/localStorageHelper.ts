import { LocalStorageItem } from "./core.types"
import EncryptionService from "./encryption"
import { getSecurePrefix } from "./utils"

const KEY_PREFIX = getSecurePrefix()

/**
 * Function to preload all the local storage data
 * @returns
 */
const getAllLocalStorageItems = (): LocalStorageItem => {
  const localStorageItems: LocalStorageItem = {}

  if (typeof window === "undefined") return localStorageItems

  const encrypt = new EncryptionService()

  for (const [key, value] of Object.entries(localStorage)) {
    if (!key.startsWith(KEY_PREFIX)) {
      continue
    }

    const decryptedValue = encrypt.decrypt(value)

    if (decryptedValue === null) {
      continue
    }

    const keyType = key.replace(KEY_PREFIX, "")[0]
    const parsedKey = key.replace(/[.][bjns][.]/, ".")

    let parsedValue = null

    switch (keyType) {
      case "b":
        parsedValue = decryptedValue === "true"
        break
      case "j":
        parsedValue = JSON.parse(decryptedValue)
        break
      case "n":
        parsedValue = Number(decryptedValue)
        break
      default:
        parsedValue = decryptedValue
    }
    localStorageItems[parsedKey] = parsedValue
  }

  return localStorageItems
}

export default getAllLocalStorageItems
