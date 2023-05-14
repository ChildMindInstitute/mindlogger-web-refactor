import { useCallback } from "react"

import { AnswerTypesPayload } from "~/shared/api"
import { useEncryption } from "~/shared/utils"

type EncryptionParams = {
  privateKey: number[]
  publicKey: number[]
  prime: number[]
  base: number[]
  accountId: string
}

type AnswerPayload = {
  answers: Array<AnswerTypesPayload>
}

export const useEncrypteAnswers = () => {
  const { generateAesKey, encryptDataByKey } = useEncryption()

  const encrypteAnswers = useCallback(
    (userId: string, encryptionParamsJSON: string, answerPayload: AnswerPayload): string => {
      const encryptionParams: EncryptionParams = JSON.parse(encryptionParamsJSON)
      const key = generateAesKey(encryptionParams)

      const answersJSON = JSON.stringify(answerPayload.answers)
      return encryptDataByKey({ text: answersJSON, key })
    },
    [encryptDataByKey, generateAesKey],
  )

  return {
    encrypteAnswers,
  }
}
