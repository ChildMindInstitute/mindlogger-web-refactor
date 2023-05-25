import { useCallback } from "react"

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

type GenerateAesKeyProps = {
  userPrivateKey: number[]
  appletPublicKey: number[]
  appletPrime: number[]
  appletBase: number[]
}

export const useEncryption = () => {
  const generateUserPrivateKey = useCallback((params: GenerateUserPrivateKeyParams) => {
    return encryption.getPrivateKey(params)
  }, [])

  const generateAesKey = useCallback((params: GenerateAesKeyProps) => {
    return encryption.getAESKey(params)
  }, [])

  const createEncryptionService = useCallback(
    (params: InputProps) => {
      const aesKey = generateAesKey({
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
    },
    [generateAesKey],
  )

  return {
    createEncryptionService,
    generateUserPrivateKey,
  }
}
