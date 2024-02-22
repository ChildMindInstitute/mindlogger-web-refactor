import { securelocalStorageService } from '~/shared/utils';

const createSecureUserPrivateKeyStorage = () => {
  const name = 'userPrivateKey';

  const setUserPrivateKey = (userPrivateKey: number[]) => {
    securelocalStorageService.setItem(name, userPrivateKey);
  };

  const getUserPrivateKey = () => {
    return securelocalStorageService.getItem(name) as number[] | null;
  };

  const clearUserPrivateKey = () => {
    securelocalStorageService.removeItem(name);
  };

  return { setUserPrivateKey, getUserPrivateKey, clearUserPrivateKey };
};

export const secureUserPrivateKeyStorage = createSecureUserPrivateKeyStorage();
