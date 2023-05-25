import { useCallback } from "react"

import { AnswerTypesPayload, AppletEncryptionDTO } from "~/shared/api"
import { secureUserPrivateKeyStorage, useEncryption } from "~/shared/utils"

type AnswerPayload = {
  answers: Array<AnswerTypesPayload>
}

type EncryptAnswerReturn = string

export const useEncrypteAnswers = () => {
  const { createEncryptionService } = useEncryption()

  const encrypteAnswers = useCallback(
    (encryptionParams: AppletEncryptionDTO | null, answerPayload: AnswerPayload): EncryptAnswerReturn => {
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

      return encryptionService.encrypt(JSON.stringify(answerPayload.answers))
    },
    [createEncryptionService],
  )

  return {
    encrypteAnswers,
  }
}
