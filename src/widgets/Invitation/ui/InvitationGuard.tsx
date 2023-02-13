import { Navigate, useLocation } from "react-router-dom"

import InvitationWidget from "./InvitationWidget"

import { userModel } from "~/entities/user"
import { ROUTES } from "~/shared/utils"

interface InvitationGuardProps {
  keyParams: string
  emailParams: string
}

const InvitationGuard = ({ keyParams }: InvitationGuardProps) => {
  const location = useLocation()

  const { user } = userModel.hooks.useUserState()
  const tokens = userModel.hooks.useTokensState()

  const isAuthenticated = user.id && tokens?.accessToken

  const redirectState = {
    isInvitationFlow: true,
    backRedirectPath: `${location.pathname}${location.search}`,
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login.path} state={redirectState} />
  }

  return <InvitationWidget keyParams={keyParams} />
}

export default InvitationGuard
