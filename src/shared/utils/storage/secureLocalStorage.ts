import { SecureStorage } from "~/shared/libs/secure-storage"

interface SecureLocalStorageServiceOutput {
  getItem: (key: string) => string | number | boolean | object | null
  setItem: (key: string, value: string | number | boolean | object) => void
  removeItem: (key: string) => void
  clearStorage: () => void
}

const secureLocalStorageInstance = new SecureStorage(localStorage)

const createSecureLocalStorageService = (): SecureLocalStorageServiceOutput => {
  const setItem = (key: string, value: string | number | boolean | object) => {
    secureLocalStorageInstance.setItem(key, value)
  }

  const removeItem = (key: string) => {
    secureLocalStorageInstance.removeItem(key)
  }

  const clearStorage = () => {
    secureLocalStorageInstance.clear()
  }

  const getItem = (key: string) => {
    return secureLocalStorageInstance.getItem(key)
  }

  return {
    getItem,
    setItem,
    removeItem,
    clearStorage,
  }
}

export const securelocalStorageService = createSecureLocalStorageService()
