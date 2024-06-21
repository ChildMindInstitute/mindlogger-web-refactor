import { EncryptionDTO } from '~/shared/api';
import { encryption } from '~/shared/utils';

export const generateUserPublicKey = (
  appletEncryption: EncryptionDTO | null,
  userPrivateKey: number[] | null,
): string => {
  if (!appletEncryption) {
    throw new Error('Applet encryption is not defined');
  }

  if (!userPrivateKey) {
    throw new Error('Private key is not defined');
  }

  const { prime, base } = appletEncryption;

  const userPublicKey = encryption.getPublicKey({
    privateKey: userPrivateKey,
    appletPrime: JSON.parse(prime) as number[],
    appletBase: JSON.parse(base) as number[],
  });

  return JSON.stringify(userPublicKey);
};
