import { Buffer } from 'buffer';
import crypto from 'node:crypto';

import { VITE_IV_LENGTH } from '~/shared/constants';

type GetPrivateKeyProps = { userId: string; email: string; password: string };
type GetPublicKeyProps = { privateKey: number[]; appletPrime: number[]; appletBase: number[] };

type GetAESKeyProps = {
  userPrivateKey: number[];
  appletPublicKey: number[];
  appletPrime: number[];
  appletBase: number[];
};

type EncryptDataProps = { text: string; key: number[] };
type DecryptDataProps = { text: string; key: number[] };

class Encryption {
  public getPrivateKey = ({ userId, email, password }: GetPrivateKeyProps): number[] => {
    const key1 = crypto
      .createHash('sha512')
      .update(password + email)
      .digest();
    const key2 = crypto
      .createHash('sha512')
      .update(userId + email)
      .digest();

    return Array.from(Buffer.concat([Buffer.from(key1), Buffer.from(key2)]));
  };

  public getPublicKey = ({ appletPrime, appletBase, privateKey }: GetPublicKeyProps): number[] => {
    const key = crypto.createDiffieHellman(Buffer.from(appletPrime), Buffer.from(appletBase));
    key.setPrivateKey(Buffer.from(privateKey));
    key.generateKeys();

    return Array.from(key.getPublicKey());
  };

  public getAESKey = ({
    userPrivateKey,
    appletPublicKey,
    appletPrime,
    appletBase,
  }: GetAESKeyProps): number[] => {
    const key = crypto.createDiffieHellman(Buffer.from(appletPrime), Buffer.from(appletBase));
    key.setPrivateKey(Buffer.from(userPrivateKey));

    const secretKey = key.computeSecret(Buffer.from(appletPublicKey));

    return Array.from(crypto.createHash('sha256').update(secretKey).digest());
  };

  public encryptData = ({ text, key }: EncryptDataProps): string => {
    const iv: Buffer = crypto.randomBytes(Number(VITE_IV_LENGTH));
    const keyBuffer = Buffer.from(key);
    const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);
    let encrypted: Buffer = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  };

  public decryptData = ({ text, key }: DecryptDataProps): string => {
    const textParts = text.split(':');
    const firstPart = textParts.shift();

    if (!firstPart) {
      throw new Error('[Encryption:decryptData] Text decryption failed. First part is empty.');
    }

    const iv = Buffer.from(firstPart, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    const decrypted = decipher.update(encryptedText);

    try {
      return decrypted.toString() + decipher.final('utf8');
    } catch (error) {
      console.error('Decrypt data failed. Text:', text, 'key:', key, 'error:', error);

      return JSON.stringify([{ type: '', time: '', screen: '' }]);
    }
  };
}

export const encryption = new Encryption();
