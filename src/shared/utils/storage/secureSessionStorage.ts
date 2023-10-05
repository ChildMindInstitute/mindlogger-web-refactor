import { SecureStorage } from "~/shared/libs/secure-storage"

interface SecureSessionStorageServiceOutput {
  getItem: (key: string) => string | number | boolean | object | null
  setItem: (key: string, value: string | number | boolean | object) => void
  removeItem: (key: string) => void
  clearStorage: () => void
}

const secureSessionStorageInstance = new SecureStorage(sessionStorage)

const createSecureSessionStorageService = (): SecureSessionStorageServiceOutput => {
  const setItem = (key: string, value: string | number | boolean | object) => {
    secureSessionStorageInstance.setItem(key, value)
  }

  const removeItem = (key: string) => {
    secureSessionStorageInstance.removeItem(key)
  }

  const clearStorage = () => {
    secureSessionStorageInstance.clear()
  }

  const getItem = (key: string) => {
    return secureSessionStorageInstance.getItem(key)
  }

  return {
    getItem,
    setItem,
    removeItem,
    clearStorage,
  }
}

export const secureSessionStorageService = createSecureSessionStorageService()
