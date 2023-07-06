import { useCallback } from "react"

import { AppletEncryptionDTO } from "~/shared/api"
import { secureUserPrivateKeyStorage, useEncryption } from "~/shared/utils"

type EncryptAnswerReturn = string

export const useEncryptPayload = () => {
  const { createEncryptionService } = useEncryption()

  const encryptePayload = useCallback(
    (encryptionParams: AppletEncryptionDTO | null, payload: unknown): EncryptAnswerReturn => {
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

      const payloadString = typeof payload === "string" ? payload : JSON.stringify(payload)

      return encryptionService.encrypt(payloadString)
    },
    [createEncryptionService],
  )

  return {
    encryptePayload,
  }
}
