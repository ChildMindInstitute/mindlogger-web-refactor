import { useCallback } from "react"

import { AppletEncryptionDTO } from "~/shared/api"
import { useEncryption } from "~/shared/utils"

export const useEncryptPayload = () => {
  const { createEncryptionService } = useEncryption()

  const encryptPayload = useCallback(
    (encryptionParams: AppletEncryptionDTO | null, payload: unknown, userPrivateKey: number[] | null): string => {
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
    encryptPayload,
  }
}
