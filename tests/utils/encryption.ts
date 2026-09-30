import { Buffer } from 'buffer';
import crypto from 'node:crypto';

// Copied from src/shared/utils/encryption (that version needs import.meta.env, which isn't available here).
const IV_LENGTH = 16;

// Public numbers used to build the encryption keys (not secret), copied from api-client/applet-api.ts.
// prettier-ignore
export const APPLET_PRIME: number[] = [148,187,155,90,57,66,144,3,154,113,206,8,135,246,49,190,183,47,52,148,8,73,234,204,210,211,80,234,245,125,69,247,156,15,20,218,136,226,167,14,47,135,101,213,192,25,237,113,187,103,7,28,249,119,213,91,251,132,152,74,168,226,116,182,197,242,230,164,138,2,10,165,175,236,34,124,33,126,240,207,161,211,50,136,184,165,168,33,187,35,184,198,52,251,14,217,188,249,68,18,96,37,102,82,219,233,0,147,37,202,223,200,15,209,242,17,196,110,125,146,117,131,247,37,73,232,101,115];
export const APPLET_BASE: number[] = [2];

type Credentials = { userId: string; email: string; password: string };

export const getPrivateKey = ({ userId, email, password }: Credentials): number[] => {
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

export const getPublicKey = (privateKey: number[]): number[] => {
  const key = crypto.createDiffieHellman(Buffer.from(APPLET_PRIME), Buffer.from(APPLET_BASE));
  key.setPrivateKey(Buffer.from(privateKey));
  key.generateKeys();

  return Array.from(key.getPublicKey());
};

export const getAesKey = (userPrivateKey: number[], appletPublicKey: number[]): number[] => {
  const key = crypto.createDiffieHellman(Buffer.from(APPLET_PRIME), Buffer.from(APPLET_BASE));
  key.setPrivateKey(Buffer.from(userPrivateKey));
  const secretKey = key.computeSecret(Buffer.from(appletPublicKey));

  return Array.from(crypto.createHash('sha256').update(secretKey).digest());
};

export const encryptData = (text: string, key: number[]): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export type AppletEncryption = {
  publicKey: string;
  prime: string;
  base: string;
  accountId: string;
};

// Builds the encryption block an applet needs, from the owner's login info.
export const buildAppletEncryption = (owner: Credentials): AppletEncryption => ({
  publicKey: JSON.stringify(getPublicKey(getPrivateKey(owner))),
  prime: JSON.stringify(APPLET_PRIME),
  base: JSON.stringify(APPLET_BASE),
  accountId: owner.userId,
});
