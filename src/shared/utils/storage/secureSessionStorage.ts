import { secureSessionStorage } from "~/shared/libs/secure-storage"

interface SecureSessionStorageServiceOutput {
  getItem: (key: string) => string | number | boolean | object | null
  setItem: (key: string, value: string | number | boolean | object) => void
  removeItem: (key: string) => void
  clearStorage: () => void
}

const createSecureSessionStorageService = (): SecureSessionStorageServiceOutput => {
  const setItem = (key: string, value: string | number | boolean | object) => {
    secureSessionStorage.setItem(key, value)
  }

  const removeItem = (key: string) => {
    secureSessionStorage.removeItem(key)
  }

  const clearStorage = () => {
    secureSessionStorage.clear()
  }

  const getItem = (key: string) => {
    return secureSessionStorage.getItem(key)
  }

  return {
    getItem,
    setItem,
    removeItem,
    clearStorage,
  }
}

export const secureSessionStorageService = createSecureSessionStorageService()
