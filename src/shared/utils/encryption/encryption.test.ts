import { vi } from 'vitest';

import { encryption } from './encryption';
import { answerRequestExample, encryptedMockAnswerRequest } from './mockData';

vi.stubEnv('VITE_IV_LENGTH', '16');

describe('Encryption', () => {
  const userPrivateKey = [
    112, 71, 238, 203, 90, 120, 103, 16, 57, 43, 94, 32, 207, 66, 195, 72, 43, 84, 20, 63, 101, 90, 159, 250, 106, 218,
    87, 215, 129, 10, 220, 181, 183, 225, 176, 119, 36, 24, 99, 140, 3, 250, 31, 105, 229, 55, 146, 101, 109, 103, 42,
    111, 97, 57, 109, 144, 171, 69, 44, 43, 124, 146, 222, 101, 33, 103, 136, 206, 146, 172, 2, 93, 188, 204, 222, 186,
    86, 230, 161, 56, 115, 22, 199, 239, 173, 47, 245, 61, 85, 4, 104, 79, 158, 66, 161, 116, 181, 26, 72, 8, 46, 115,
    72, 31, 210, 202, 222, 119, 125, 217, 159, 198, 255, 60, 96, 222, 147, 10, 21, 144, 204, 39, 76, 55, 54, 147, 91,
    169,
  ];
  const appletPublicKey = [
    138, 216, 39, 18, 199, 98, 15, 131, 163, 3, 89, 195, 100, 254, 5, 41, 3, 46, 28, 213, 64, 24, 232, 119, 219, 246,
    46, 24, 252, 92, 19, 176, 152, 43, 197, 89, 132, 66, 59, 234, 146, 215, 196, 87, 113, 166, 179, 68, 9, 133, 244, 4,
    240, 19, 254, 51, 73, 213, 23, 185, 168, 238, 222, 210, 46, 187, 111, 233, 121, 162, 232, 92, 223, 0, 76, 83, 6,
    214, 97, 144, 43, 130, 252, 160, 179, 236, 182, 60, 1, 40, 112, 110, 213, 106, 160, 122, 196, 24, 142, 236, 231,
    102, 92, 180, 93, 255, 164, 212, 236, 71, 144, 162, 107, 46, 155, 223, 4, 189, 160, 44, 141, 140, 187, 78, 240, 8,
    62, 40,
  ];
  const appletPrime = [
    188, 223, 9, 149, 64, 85, 250, 187, 46, 43, 7, 141, 98, 242, 217, 92, 165, 224, 181, 233, 215, 8, 78, 218, 132, 92,
    205, 217, 68, 104, 156, 149, 203, 154, 98, 135, 113, 216, 27, 127, 182, 178, 20, 77, 55, 90, 35, 34, 177, 253, 33,
    129, 91, 152, 221, 91, 175, 206, 119, 211, 228, 153, 125, 219, 231, 255, 207, 84, 23, 31, 124, 216, 95, 207, 228,
    144, 74, 114, 60, 44, 139, 192, 167, 89, 9, 227, 100, 155, 200, 81, 121, 8, 33, 189, 116, 50, 127, 62, 60, 127, 250,
    195, 25, 252, 112, 172, 137, 183, 213, 2, 207, 49, 161, 185, 65, 211, 21, 44, 233, 188, 143, 13, 44, 78, 62, 78,
    234, 115,
  ];
  const appletBase = [2];

  describe('getPrivateKey', () => {
    it('should return a valid private key', () => {
      const userId = '123';
      const email = 'test@example.com';
      const password = 'password123';

      const generatedPrivateKey = encryption.getPrivateKey({
        userId,
        email,
        password,
      });

      expect(Array.isArray(generatedPrivateKey)).toBe(true);
      expect(generatedPrivateKey.every(num => typeof num === 'number')).toBe(true);
    });
  });

  describe('getPublicKey', () => {
    it('should return a valid public key', () => {
      const generatedPublicKey = encryption.getPublicKey({
        appletPrime,
        appletBase,
        privateKey: userPrivateKey,
      });

      expect(Array.isArray(generatedPublicKey)).toBe(true);
      expect(generatedPublicKey.every(num => typeof num === 'number')).toBe(true);
    });
  });

  describe('getAESKey', () => {
    it('should return a valid AES key', () => {
      const aesKey = encryption.getAESKey({
        userPrivateKey,
        appletPublicKey,
        appletPrime,
        appletBase,
      });

      expect(Array.isArray(aesKey)).toBe(true);
      expect(aesKey.every(num => typeof num === 'number')).toBe(true);
    });
  });

  // TODO: Fix encryption tests
  // It is commented now because crypto.createCipheriv is not working for some reason.
  // crypto.createCipheriv is used in encryptData method return empty Uint8Array

  // describe("encryptData", () => {
  //   it("should return an encrypted string", () => {
  //     const text = "Hello world!"

  //     const aesKey = encryption.getAESKey({
  //       userPrivateKey,
  //       appletPublicKey,
  //       appletPrime,
  //       appletBase,
  //     })

  //     const encryptedText = encryption.encryptData({ text, key: aesKey })

  //     expect(typeof encryptedText).toBe("string")
  //     expect(encryptedText.length).toBeGreaterThan(0)
  //   })
  // })

  describe('decryptData', () => {
    it('should return the decrypted text', () => {
      const encryptedText = '7f3eeb1af2a3963832cceef81fedc6b9:4c1d5f0dc1ce05f714e9b2ad32932896';

      const aesKey = encryption.getAESKey({
        userPrivateKey,
        appletPublicKey,
        appletPrime,
        appletBase,
      });

      const decryptedText = encryption.decryptData({
        text: encryptedText,
        key: aesKey,
      });

      expect(decryptedText).toBe('Hello world!');
    });
  });

  describe('getPrivateKey', () => {
    it('should return the private key', () => {
      const result = [
        119, 246, 61, 4, 69, 250, 117, 76, 124, 94, 83, 227, 223, 184, 230, 126, 252, 194, 122, 167, 138, 161, 129, 226,
        125, 229, 100, 32, 41, 219, 255, 183, 193, 232, 127, 139, 132, 37, 7, 138, 162, 69, 59, 54, 31, 108, 146, 220,
        103, 194, 154, 35, 179, 57, 97, 219, 210, 141, 118, 82, 66, 131, 194, 237, 14, 117, 143, 233, 157, 169, 111,
        173, 6, 235, 26, 233, 23, 248, 138, 49, 100, 206, 165, 177, 151, 205, 97, 103, 85, 41, 181, 124, 102, 136, 159,
        89, 204, 213, 232, 28, 154, 3, 10, 31, 140, 201, 135, 91, 2, 129, 40, 210, 175, 162, 44, 241, 89, 178, 78, 98,
        148, 11, 241, 144, 227, 216, 75, 249,
      ];
      const userParams = {
        email: 'linuxweeva@gmail.com',
        password: 'Scope;09',
        userId: '2923f4a9-20ef-4995-a340-251d96ff3082',
      };

      const generatedPrivateKey = encryption.getPrivateKey(userParams);

      expect(generatedPrivateKey).toStrictEqual(result);
    });
  });

  // TODO: Fix encryption tests
  // It is commented now because crypto.createCipheriv is not working for some reason.
  // crypto.createCipheriv is used in encryptData method return empty Uint8Array

  // describe("encrypt AnswerRequest", () => {
  //   it("should return an encrypted string of real answer request", () => {
  //     const text = JSON.stringify(answerRequestExample)

  //     const aesKey = encryption.getAESKey({
  //       userPrivateKey,
  //       appletPublicKey,
  //       appletPrime,
  //       appletBase,
  //     })

  //     const encryptedText = encryption.encryptData({ text, key: aesKey })

  //     expectTypeOf(encryptedText).toBeString()
  //     expect(encryptedText.length).toBeGreaterThan(0)
  //   })
  // })

  describe('decrypt AnswerRequest', () => {
    it('should return the decrypted answer Request', () => {
      const encryptedText = encryptedMockAnswerRequest;

      const aesKey = encryption.getAESKey({
        userPrivateKey,
        appletPublicKey,
        appletPrime,
        appletBase,
      });

      const decryptedText = encryption.decryptData({
        text: encryptedText,
        key: aesKey,
      });

      const originalText = JSON.stringify(answerRequestExample);

      expect(decryptedText).toBe(originalText);
    });
  });
});
