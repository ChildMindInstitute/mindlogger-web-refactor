import { StorageItem } from "./core.types"
import EncryptionService from "./encryption"
import { getSecurePrefix } from "./utils"

const KEY_PREFIX = getSecurePrefix()

/**
 * Function to preload all the local storage data
 * @returns
 */
const getAllStorageItems = (storage: Storage): StorageItem => {
  const storageItems: StorageItem = {}

  if (typeof window === "undefined") return storageItems

  const encrypt = new EncryptionService()

  for (const [key, value] of Object.entries(storage)) {
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
    storageItems[parsedKey] = parsedValue
  }

  return storageItems
}

export default getAllStorageItems
