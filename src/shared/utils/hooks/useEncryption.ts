import { useCallback } from "react"

import { encryption } from "../encryption"

type GenerateAesKeyProps = {
  accountId: string
  privateKey: number[]
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
  const generateAesKey = useCallback(({ accountId, privateKey, prime, base }: GenerateAesKeyProps) => {
    return encryption.getAESKey(privateKey, accountId, prime, base)
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
