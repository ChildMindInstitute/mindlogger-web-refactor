import CryptoJS from "crypto-js"

class Encryption {
  public encrypt(text: string, key: string): string {
    const iv = CryptoJS.lib.WordArray.random(import.meta.env.VITE_IV_LENGTH)
    const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), { iv: iv })
    const cipherText = iv.toString() + ":" + encrypted.ciphertext.toString(CryptoJS.enc.Hex)
    return cipherText
  }

  public decrypt(text: string, key: string) {
    const parts = text.split(":")
    const iv = CryptoJS.enc.Hex.parse(parts.shift()!)
    const encryptedText = CryptoJS.enc.Hex.parse(parts.join(":"))

    const params: CryptoJS.lib.CipherParams = {
      ciphertext: encryptedText,
    }

    const decrypted = CryptoJS.AES.decrypt(params, CryptoJS.enc.Utf8.parse(key), { iv: iv })

    return decrypted.toString(CryptoJS.enc.Utf8)
  }
}

export const aesEncryption = new Encryption()
