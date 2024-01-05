import { AppletEncryptionDTO } from "../../api"
import { encryption } from "../encryption"

type InputProps = AppletEncryptionDTO & {
  privateKey: number[]
}

type GenerateUserPrivateKeyParams = {
  userId: string
  email: string
  password: string
}

export const useEncryption = () => {
  const generateUserPrivateKey = (params: GenerateUserPrivateKeyParams) => encryption.getPrivateKey(params)

  const createEncryptionService = (params: InputProps) => {
    const aesKey = encryption.getAESKey({
      appletPrime: JSON.parse(params.prime),
      appletBase: JSON.parse(params.base),
      appletPublicKey: JSON.parse(params.publicKey),
      userPrivateKey: params.privateKey,
    })

    const encrypt = (json: string) => {
      return encryption.encryptData({
        text: json,
        key: aesKey,
      })
    }

    return { encrypt }
  }

  return {
    createEncryptionService,
    generateUserPrivateKey,
  }
}
