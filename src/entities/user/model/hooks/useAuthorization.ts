import { useTokensState } from './useTokensState';
import { useUserState } from './useUserState';
import { Tokens } from '../../lib';
import { UserStore } from '../user.slice';

import { secureTokensStorage } from '~/shared/utils';

type AuthorizedReturn = {
  isAuthorized: true;
  user: UserStore;
  tokens: Tokens;
};

type UnauthorizedReturn = {
  isAuthorized: false;
  user: null;
  tokens: null;
};

type Return = AuthorizedReturn | UnauthorizedReturn;

export const useAuthorization = (): Return => {
  // Use event-driven state for reactivity (updates UI when tokens change)
  const tokensFromState = useTokensState();
  const { user } = useUserState();

  // Also read directly from storage for immediate consistency after login
  // This handles the race condition where navigation happens before React state updates
  const tokensFromStorage = secureTokensStorage.getTokens();

  // Use tokens from either source - storage is the source of truth
  const tokens = tokensFromState || tokensFromStorage;

  const isAuthorized = !!(tokens && user.id);

  return isAuthorized
    ? { isAuthorized: true, user, tokens }
    : { isAuthorized: false, user: null, tokens: null };
};
