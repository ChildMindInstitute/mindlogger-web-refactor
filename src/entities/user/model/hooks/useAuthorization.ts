import { useTokensState } from './useTokensState';
import { useUserState } from './useUserState';
import { Tokens } from '../../lib';
import { UserStore } from '../user.slice';

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
  const tokens = useTokensState();
  const { user } = useUserState();

  return tokens && user.id
    ? { isAuthorized: true, user, tokens }
    : { isAuthorized: false, user: null, tokens: null };
};
