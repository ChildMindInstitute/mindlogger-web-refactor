import { useCallback } from "react"

import { AnswerTypesPayload, AppletEncryptionDTO } from "~/shared/api"
import { secureUserPrivateKeyStorage, useEncryption } from "~/shared/utils"

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
    (encryptionParams: AppletEncryptionDTO | null, answerPayload: AnswerPayload): EncryptAnswerReturn[] => {
      if (!encryptionParams) {
        throw new Error("Encryption params is undefined")
      }

      const userPrivateKey = secureUserPrivateKeyStorage.getUserPrivateKey()

      if (!userPrivateKey) {
        throw new Error("User private key is undefined")
      }

      // Need this public key for the future, when BE will be ready
      const userPublicKey = generateUserPublicKey({
        privateKey: userPrivateKey,
        appletPrime: JSON.parse(encryptionParams.prime),
        appletBase: JSON.parse(encryptionParams.base),
      })

      const key = generateAesKey({
        userPrivateKey,
        appletPublicKey: JSON.parse(encryptionParams.publicKey),
        appletPrime: JSON.parse(encryptionParams.prime),
        appletBase: JSON.parse(encryptionParams.base),
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
