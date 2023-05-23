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
  const { createEncryptionService } = useEncryption()

  const encrypteAnswers = useCallback(
    (encryptionParams: AppletEncryptionDTO | null, answerPayload: AnswerPayload): EncryptAnswerReturn[] => {
      if (!encryptionParams) {
        throw new Error("Encryption params is undefined")
      }

      const userPrivateKey = secureUserPrivateKeyStorage.getUserPrivateKey()

      if (!userPrivateKey) {
        throw new Error("User private key is undefined")
      }

      const encryptionService = createEncryptionService({
        ...encryptionParams,
        privateKey: userPrivateKey,
      })

      return answerPayload.answers.map(answerItem => {
        const encryptedAnswer = encryptionService.encrypt(JSON.stringify(answerItem.answer))

        return {
          ...answerItem,
          answer: encryptedAnswer,
        }
      })
    },
    [createEncryptionService],
  )

  return {
    encrypteAnswers,
  }
}
