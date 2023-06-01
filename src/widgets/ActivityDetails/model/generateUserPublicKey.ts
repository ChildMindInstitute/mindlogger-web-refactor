import { AppletEncryptionDTO } from "~/shared/api"
import { encryption, secureUserPrivateKeyStorage } from "~/shared/utils"

export const generateUserPublicKey = (appletEncryption: AppletEncryptionDTO | null): string => {
  if (!appletEncryption) {
    throw new Error("Applet encryption is not defined")
  }

  const userPrivateKey = secureUserPrivateKeyStorage.getUserPrivateKey()

  if (!userPrivateKey) {
    throw new Error("User private key is not defined")
  }

  const { prime, base } = appletEncryption

  const userPublicKey = encryption.getPublicKey({
    privateKey: userPrivateKey,
    appletPrime: JSON.parse(prime),
    appletBase: JSON.parse(base),
  })

  return JSON.stringify(userPublicKey)
}