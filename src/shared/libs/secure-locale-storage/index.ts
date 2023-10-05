import { LocalStorageItem } from "./core.types"
import EncryptionService from "./encryption"
import getAllLocalStorageItems from "./localStorageHelper"
import { getSecurePrefix } from "./utils"

const KEY_PREFIX = getSecurePrefix()

/**
 * Function to return datatype of the value we stored
 * @param value
 * @returns
 */
const getDataType = (value: string | object | number | boolean | null) => {
  return typeof value === "object" ? "j" : typeof value === "boolean" ? "b" : typeof value === "number" ? "n" : "s"
}

/**
 * Function to create local storage key
 * @param key
 * @param value
 */
const getLocalKey = (key: string, value: string | object | number | boolean | null) => {
  const keyType = getDataType(value)
  return KEY_PREFIX + `${keyType}.` + key
}

/**
 * This version of local storage supports the following data types as it is and other data types will be treated as string
 * object, string, number and Boolean
 */
class SecureLocalStorage {
  private _localStorageItems: LocalStorageItem = {}

  constructor() {
    this._localStorageItems = getAllLocalStorageItems()
  }

  /**
   * Function to set value to secure local storage
   * @param key to be added
   * @param value value to be added
   */
  setItem(key: string, value: string | object | number | boolean) {
    const parsedValue = typeof value === "object" ? JSON.stringify(value) : value + ""
    const parsedKeyLocal = getLocalKey(key, value)
    const parsedKey = KEY_PREFIX + key
    if (key != null) this._localStorageItems[parsedKey] = value
    const encrypt = new EncryptionService()
    localStorage.setItem(parsedKeyLocal, encrypt.encrypt(parsedValue))
  }

  /**
   * Function to get value from secure local storage
   * @param key to get
   * @returns
   */
  getItem(key: string): string | object | number | boolean | null {
    const parsedKey = KEY_PREFIX + key
    return this._localStorageItems[parsedKey] || null
  }

  /**
   * Function to remove item from secure local storage
   * @param key to be removed
   */
  removeItem(key: string) {
    const parsedKey = KEY_PREFIX + key
    const value = this._localStorageItems[parsedKey]
    const parsedKeyLocal = getLocalKey(key, value)
    if (this._localStorageItems[parsedKey] !== undefined) delete this._localStorageItems[parsedKey]
    localStorage.removeItem(parsedKeyLocal)
  }

  /**
   * Function to clear secure local storage
   */
  clear() {
    this._localStorageItems = {}
    localStorage.clear()
  }
}

const secureLocalStorage = new SecureLocalStorage()

export default secureLocalStorage
