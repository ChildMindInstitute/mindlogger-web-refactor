/* eslint-disable no-undef */
import clientJS from "./fingerprint.lib"
import { getHashKey } from "./helpers"

const HASH_KEY = "E86E2612010258B35137"

/**
 * Function to get browser finger print
 * @returns
 */
const getFingerprint = () => {
  const HASH_KEY_CUSTOM = getHashKey() || HASH_KEY

  if (typeof window === "undefined") return HASH_KEY_CUSTOM
  return clientJS.getFingerprint() + HASH_KEY_CUSTOM
}

export default getFingerprint
