import { Navigate, Route, Routes } from "react-router-dom"

import ActivityListPage from "./ActivityList"
import Dashboard from "./Dashboard"
import ForgotPassword from "./ForgotPassword"
import { InvitationPage } from "./Invitation"
import { InvitationAcceptPage } from "./InvitationAccept"
import { InvitationDeclinePage } from "./InvitationDecline"
import LoginPage from "./Login"
import { PrivateJoinPage } from "./PrivateJoin"
import Profile from "./Profile"
import { PublicJoinPage } from "./PublicJoin"
import RecoveryPassword from "./RecoveryPassword"
import Settings from "./Settings"
import SignupPage from "./Signup"

import { userModel } from "~/entities/user"
import { ROUTES } from "~/shared/utils"
import { LogoutTracker } from "~/widgets/LogoutTracker"
import { ProtectedRoute } from "~/widgets/ProtectedRoute"

const ApplicationRouter = (): JSX.Element | null => {
  const tokens = userModel.hooks.useTokensState()

  if (tokens?.accessToken) {
    return (
      <LogoutTracker>
        <Routes>
          <Route element={<ProtectedRoute token={tokens?.accessToken} />}>
            <Route index path={ROUTES.applets.path} element={<Dashboard />} />
            <Route path={ROUTES.profile.path} element={<Profile />} />
            <Route path={ROUTES.settings.path} element={<Settings />} />
            <Route path={ROUTES.activityList.path} element={<ActivityListPage />} />
            <Route path={ROUTES.invitation.path} element={<InvitationPage />} />
            <Route path={ROUTES.privateJoin.path} element={<PrivateJoinPage />} />
            <Route path={ROUTES.invitationAccept.path} element={<InvitationAcceptPage />} />
            <Route path={ROUTES.invitationDecline.path} element={<InvitationDeclinePage />} />

            <Route path="*" element={<Navigate to={ROUTES.applets.path} />} />
          </Route>
        </Routes>
      </LogoutTracker>
    )
  }

  return (
    <Routes>
      <Route index path={ROUTES.login.path} element={<LoginPage />} />
      <Route path={ROUTES.signup.path} element={<SignupPage />} />
      <Route path={ROUTES.forgotPassword.path} element={<ForgotPassword />} />
      <Route path={ROUTES.changePassword.path} element={<RecoveryPassword />} />
      <Route path={ROUTES.invitation.path} element={<InvitationPage />} />
      <Route path={ROUTES.privateJoin.path} element={<PrivateJoinPage />} />
      <Route path={ROUTES.publicJoin.path} element={<PublicJoinPage />} />

      <Route path="*" element={<Navigate to={ROUTES.login.path} />} />
    </Routes>
  )
}

export default ApplicationRouter
