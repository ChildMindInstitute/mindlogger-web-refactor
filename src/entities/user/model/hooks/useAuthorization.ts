import { Tokens } from "../../lib"
import { UserStore } from "../user.slice"
import { useTokensState } from "./useTokensState"
import { useUserState } from "./useUserState"

type AuthorizedReturn = {
  isAuthorized: true
  user: UserStore
  tokens: Tokens
}

type UnauthorizedReturn = {
  isAuthorized: false
  user: null
  tokens: null
}

type Return = AuthorizedReturn | UnauthorizedReturn

export const useAuthorization = (): Return => {
  const tokens = useTokensState()
  const { user } = useUserState()

  const isAuthorized = Boolean(tokens && user.id)

  return isAuthorized
    ? { isAuthorized: true, user, tokens: tokens! }
    : { isAuthorized: false, user: null, tokens: null }
}
