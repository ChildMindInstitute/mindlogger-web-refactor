import { useEffect, useState } from 'react';

import { Tokens } from '../../lib';

import { EventEmitter, secureTokensStorage } from '~/shared/utils';

export const useTokensState = () => {
  const [tokens, setTokens] = useState<Tokens | null>(secureTokensStorage.getTokens());

  const updateTokens = () => {
    setTokens(secureTokensStorage.getTokens());
  };

  useEffect(() => {
    EventEmitter.on('onTokensChange', updateTokens);

    return () => {
      EventEmitter.off('onTokensChange', updateTokens);
    };
  }, [setTokens]);

  return tokens;
};
