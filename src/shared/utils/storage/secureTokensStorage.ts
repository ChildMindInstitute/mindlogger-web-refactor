import { Tokens } from '~/entities/user/lib';
import { EventEmitter, securelocalStorageService } from '~/shared/utils';

const createSecureTokensStorage = () => {
  const name = 'tokens';

  const setTokens = (data: Tokens) => {
    securelocalStorageService.setItem(name, data);
    EventEmitter.emit('onTokensChange');
  };

  const getTokens = () => {
    return securelocalStorageService.getItem(name) as Tokens | null;
  };

  const clearTokens = () => {
    securelocalStorageService.removeItem(name);
    EventEmitter.emit('onTokensChange');
  };

  return { setTokens, getTokens, clearTokens };
};

export const secureTokensStorage = createSecureTokensStorage();
