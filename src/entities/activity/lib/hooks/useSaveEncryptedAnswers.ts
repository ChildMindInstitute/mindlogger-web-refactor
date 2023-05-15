import { useCallback } from "react"

import { AnswerTypesPayload } from "~/shared/api"
import { secureUserPrivateKeyStorage, useEncryption } from "~/shared/utils"

type EncryptionParams = {
  publicKey: number[]
  prime: number[]
  base: number[]
}

type AnswerPayload = {
  answers: Array<AnswerTypesPayload>
}

type EncryptAnswerReturn = {
  activityItemId: string
  answer: string
}

export const useEncrypteAnswers = () => {
  const { generateAesKey, encryptDataByKey, generateUserPublicKey } = useEncryption()

  const encrypteAnswers = useCallback(
    (encryptionParams: EncryptionParams, answerPayload: AnswerPayload): EncryptAnswerReturn[] => {
      const userPrivateKey = secureUserPrivateKeyStorage.getUserPrivateKey()

      if (!userPrivateKey) {
        throw new Error("User private key is undefined")
      }

      // Need this public key for the future, when BE will be ready
      const userPublicKey = generateUserPublicKey({
        privateKey: userPrivateKey,
        appletPrime: encryptionParams.prime,
        appletBase: encryptionParams.base,
      })

      const key = generateAesKey({
        userPrivateKey,
        appletPublicKey: encryptionParams.publicKey,
        appletPrime: encryptionParams.prime,
        appletBase: encryptionParams.base,
      })

      return answerPayload.answers.map(answerItem => {
        const answerJSON = JSON.stringify(answerItem.answer)
        const encryptedAnswer = encryptDataByKey({ text: answerJSON, key })

        return {
          ...answerItem,
          answer: encryptedAnswer,
        }
      })
    },
    [encryptDataByKey, generateAesKey, generateUserPublicKey],
  )

  return {
    encrypteAnswers,
  }
}
