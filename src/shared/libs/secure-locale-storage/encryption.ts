import AES from "crypto-js/aes"
import Utf8 from "crypto-js/enc-utf8"

import getFingerprint from "./fingerprint"

/**
 * EncryptionService
 */
const EncryptionService = class {
  secureKey = ""

  constructor() {
    this.secureKey = getFingerprint()
  }

  /**
   * Function to encrypt data
   * @param value
   * @returns
   */
  public encrypt(value: string) {
    return AES.encrypt(value, this.secureKey).toString()
  }

  /**
   * Function to decrypt data
   * @param value
   * @returns
   */
  public decrypt(value: string) {
    try {
      const bytes = AES.decrypt(value, this.secureKey)
      return bytes.toString(Utf8) || null
    } catch (ex) {
      return null
    }
  }
}

export default EncryptionService
