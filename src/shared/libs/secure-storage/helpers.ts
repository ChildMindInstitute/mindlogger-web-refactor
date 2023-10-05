/**
 * Function to get ENV variables. Change this function depending on your project
 * @returns
 */
export const getEnv = (): Record<string, string | number> | null | undefined => {
  const env = import.meta.env

  return env
}

/**
 * Function to get SECURE_LOCAL_STORAGE_HASH_KEY
 * @returns
 */
export const getHashKey = (): string | null => {
  const env = getEnv()

  let value: string | number | null = null

  if (env) {
    value =
      env.SECURE_LOCAL_STORAGE_HASH_KEY ||
      env.REACT_APP_SECURE_LOCAL_STORAGE_HASH_KEY ||
      env.NEXT_PUBLIC_SECURE_LOCAL_STORAGE_HASH_KEY ||
      env.VITE_SECURE_LOCAL_STORAGE_HASH_KEY
  } else {
    console.warn(`react-secure-storage : process is not defined! Just a warning!`)
  }

  return value as string | null
}

/**
 * Function to get SECURE_LOCAL_STORAGE_PREFIX
 * @returns
 */
export const getStoragePrefix = (): string | null => {
  const env = getEnv()

  let value: string | number | null = null

  if (env) {
    value =
      env.SECURE_LOCAL_STORAGE_PREFIX ||
      env.REACT_APP_SECURE_LOCAL_STORAGE_PREFIX ||
      env.NEXT_PUBLIC_SECURE_LOCAL_STORAGE_PREFIX ||
      env.VITE_SECURE_LOCAL_STORAGE_PREFIX
  } else {
    console.warn(`react-secure-storage : process is not defined! Just a warning!`)
  }

  return value as string | null
}

/**
 * Function to get SECURE_LOCAL_STORAGE_DISABLED_KEYS
 * @returns
 */
export const getDisabledKeys = (): string | null => {
  const env = getEnv()

  let value: string | number | null = null
  if (env) {
    value =
      env.SECURE_LOCAL_STORAGE_DISABLED_KEYS ||
      env.REACT_APP_SECURE_LOCAL_STORAGE_DISABLED_KEYS ||
      env.NEXT_PUBLIC_SECURE_LOCAL_STORAGE_DISABLED_KEYS ||
      env.VITE_SECURE_LOCAL_STORAGE_DISABLED_KEYS
  } else {
    console.warn(`react-secure-storage : process is not defined! Just a warning!`)
  }

  return value as string | null
}
