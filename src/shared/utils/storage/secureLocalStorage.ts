import secureLocalStorage from "react-secure-storage"

interface SecureLocalStorageServiceOutput {
  getItem: (key: string) => string | number | boolean | object | null
  setItem: (key: string, value: string | number | boolean | object) => void
  removeItem: (key: string) => void
  clearStorage: () => void
}

const createSecureLocalStorageService = (): SecureLocalStorageServiceOutput => {
  const setItem = (key: string, value: string | number | boolean | object) => {
    secureLocalStorage.setItem(key, value)
  }

  const removeItem = (key: string) => {
    secureLocalStorage.removeItem(key)
  }

  const clearStorage = () => {
    secureLocalStorage.clear()
  }

  const getItem = (key: string) => {
    return secureLocalStorage.getItem(key)
  }

  return {
    getItem,
    setItem,
    removeItem,
    clearStorage,
  }
}

export const securelocalStorageService = createSecureLocalStorageService()
