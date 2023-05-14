import { useCallback } from "react"

import { encryption } from "../encryption"

type GenerateAesKeyProps = {
  userId: string
  appletPrivateKey: number[]
  prime: number[]
  base: number[]
}

type EncryptDataByKeyProps = {
  text: string
  key: number[]
}

type DecryptDataByKeyProps = {
  text: string
  key: string
}

export const useEncryption = () => {
  const generateAesKey = useCallback(({ userId, appletPrivateKey, prime, base }: GenerateAesKeyProps) => {
    return encryption.getAESKey(appletPrivateKey, userId, prime, base)
  }, [])

  const encryptDataByKey = useCallback((props: EncryptDataByKeyProps) => {
    return encryption.encryptData(props)
  }, [])

  const decryptDataByKey = useCallback((props: DecryptDataByKeyProps) => {
    return encryption.decryptData(props)
  }, [])

  return {
    generateAesKey,
    encryptDataByKey,
    decryptDataByKey,
  }
}
