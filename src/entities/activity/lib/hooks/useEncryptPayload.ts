import { useCallback } from "react"

import { AppletEncryptionDTO } from "~/shared/api"
import { useEncryption } from "~/shared/utils"

type EncryptAnswerReturn = string

export const useEncryptPayload = () => {
  const { createEncryptionService } = useEncryption()

  const encryptePayload = useCallback(
    (
      encryptionParams: AppletEncryptionDTO | null,
      payload: unknown,
      userPrivateKey: number[] | null,
    ): EncryptAnswerReturn => {
      if (!encryptionParams) {
        throw new Error("Encryption params is undefined")
      }

      if (!userPrivateKey) {
        throw new Error("Private key is undefined")
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
