import { EncryptionDTO } from '../../api';
import { encryption } from '../encryption';

type InputProps = EncryptionDTO & {
  privateKey: number[];
};

type GenerateUserPrivateKeyParams = {
  userId: string;
  email: string;
  password: string;
};

export const useEncryption = () => {
  const generateUserPrivateKey = (params: GenerateUserPrivateKeyParams) =>
    encryption.getPrivateKey(params);

  const createEncryptionService = (params: InputProps) => {
    const aesKey = encryption.getAESKey({
      appletPrime: JSON.parse(params.prime) as number[],
      appletBase: JSON.parse(params.base) as number[],
      appletPublicKey: JSON.parse(params.publicKey) as number[],
      userPrivateKey: params.privateKey,
    });

    const encrypt = (json: string) => {
      return encryption.encryptData({
        text: json,
        key: aesKey,
      });
    };

    return { encrypt };
  };

  const createDecryptionService = (params: InputProps) => {
    const aesKey = encryption.getAESKey({
      appletPrime: JSON.parse(params.prime) as number[],
      appletBase: JSON.parse(params.base) as number[],
      appletPublicKey: JSON.parse(params.publicKey) as number[],
      userPrivateKey: params.privateKey,
    });

    const decrypt = (json: string) => {
      return encryption.decryptData({
        text: json,
        key: aesKey,
      });
    };

    return { decrypt };
  };

  return {
    createEncryptionService,
    createDecryptionService,
    generateUserPrivateKey,
  };
};
