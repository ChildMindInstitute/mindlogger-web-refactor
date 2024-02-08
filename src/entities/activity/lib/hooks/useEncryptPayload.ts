import { useCallback } from 'react';

import { AppletEncryptionDTO } from '~/shared/api';
import { useEncryption } from '~/shared/utils';

export const useEncryptPayload = () => {
  const { createEncryptionService, createDecryptionService } = useEncryption();

  const encryptPayload = useCallback(
    (encryptionParams: AppletEncryptionDTO | null, payload: unknown, userPrivateKey: number[] | null): string => {
      if (!encryptionParams) {
        throw new Error('Encryption params is undefined');
      }

      if (!userPrivateKey) {
        throw new Error('Private key is undefined');
      }

      const encryptionService = createEncryptionService({
        ...encryptionParams,
        privateKey: userPrivateKey,
      });

      const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);

      return encryptionService.encrypt(payloadString);
    },
    [createEncryptionService],
  );

  const decryptPayload = useCallback(
    (encryptionParams: AppletEncryptionDTO | null, payload: string, userPrivateKey: number[] | null) => {
      if (!encryptionParams) {
        throw new Error('Encryption params is undefined');
      }

      if (!userPrivateKey) {
        throw new Error('Private key is undefined');
      }

      if (typeof payload !== 'string') {
        throw new Error('Payload shoud be a string');
      }

      const encryptionService = createDecryptionService({
        ...encryptionParams,
        privateKey: userPrivateKey,
      });

      return encryptionService.decrypt(payload);
    },
    [createDecryptionService],
  );

  return {
    encryptPayload,
    decryptPayload,
  };
};
