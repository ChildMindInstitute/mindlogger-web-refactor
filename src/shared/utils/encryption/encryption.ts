import { Buffer } from "buffer"
import * as crypto from "crypto-browserify"

class Encryption {
  public getAESKey = (appletPrivateKey: number[], userId: string, appletPrime: number[], base: number[]) => {
    const key = crypto.createDiffieHellman(Buffer.from(appletPrime), Buffer.from(base))
    key.setPrivateKey(Buffer.from(appletPrivateKey))
    const secretKey = key.computeSecret(Buffer.from(userId))
    return crypto.createHash("sha256").update(secretKey).digest()
  }

  public encryptData = ({ text, key }: { text: string; key: number[] }) => {
    const iv: Buffer = crypto.randomBytes(Number(import.meta.env.VITE_IV_LENGTH))
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv)
    let encrypted: Buffer = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`
  }

  public decryptData = ({ text, key }: { text: string; key: string }) => {
    const textParts = text.split(":")
    const iv = Buffer.from(textParts.shift()!, "hex")
    const encryptedText = Buffer.from(textParts.join(":"), "hex")
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv)
    const decrypted = decipher.update(encryptedText)

    try {
      return decrypted.toString() + decipher.final("utf8")
    } catch (error) {
      console.error("Decrypt data failed. Text:", text, "key:", key, "error:", error)

      return JSON.stringify([{ type: "", time: "", screen: "" }])
    }
  }
}

export const encryption = new Encryption()
