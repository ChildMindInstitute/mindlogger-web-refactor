import { useUserState } from "./useUserState"

import { ROUTES } from "~/shared/constants"
import {
  Mixpanel,
  secureTokensStorage,
  secureUserPrivateKeyStorage,
  useCustomNavigation,
  useEncryption,
} from "~/shared/utils"

type Params = {
  isInvitationFlow?: boolean | undefined
  backRedirectPath?: string | undefined
}

type OnLoginSuccessParams = {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    password: string
  }
  tokens: {
    accessToken: string
    refreshToken: string
    tokenType: string
  }
}

export const useOnLogin = (params: Params) => {
  const { navigate } = useCustomNavigation()
  const { setUser } = useUserState()
  const { generateUserPrivateKey } = useEncryption()

  const onLoginSuccess = ({ user, tokens }: OnLoginSuccessParams) => {
    const userPrivateKey = generateUserPrivateKey({ userId: user.id, email: user.email, password: user.password })
    secureUserPrivateKeyStorage.setUserPrivateKey(userPrivateKey)

    setUser({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName })
    secureTokensStorage.setTokens(tokens)

    if (params.isInvitationFlow) {
      navigate(params.backRedirectPath as string)
    } else {
      Mixpanel.track("Login Successful")
      Mixpanel.login(user.id)

      navigate(ROUTES.appletList.path)
    }
  }

  return { onLoginSuccess }
}
