import { Navigate, Route, Routes } from "react-router-dom"

import { Theme } from "../shared/constants"
import Layout from "../widgets/AppLayout"
import { ActivityDetailsPage } from "./ActivityDetails"
import { AppletDetailsPage } from "./AppletDetailsPage"
import { AppletListPage } from "./AppletListPage"
import { ForgotPasswordPage } from "./ForgotPassword"
import { InvitationPage } from "./Invitation"
import { InvitationAcceptPage } from "./InvitationAccept"
import { InvitationDeclinePage } from "./InvitationDecline"
import { LoginPage } from "./Login"
import { PrivateJoinPage } from "./PrivateJoin"
import { ProfilePage } from "./Profile"
import { PublicActivityDetailsPage } from "./PublicActivityDetails"
import { PublicJoinPage } from "./PublicJoin"
import { RecoveryPasswordPage } from "./RecoveryPassword"
import { SettingsPage } from "./Settings"
import { SignupPage } from "./Signup"
import { TransferOwnershipPage } from "./TransferOwnership"

import { userModel } from "~/entities/user"
import { ROUTES } from "~/shared/constants"
import { LogoutTracker } from "~/widgets/LogoutTracker"
import { ProtectedRoute } from "~/widgets/ProtectedRoute"

const ApplicationRouter = (): JSX.Element | null => {
  const tokens = userModel.hooks.useTokensState()

  if (tokens?.accessToken) {
    return (
      <LogoutTracker>
        <Routes>
          <Route element={<ProtectedRoute token={tokens?.accessToken} />}>
            <Route element={<Layout bgColor={Theme.colors.light.surface} hasFooter={false} hasHeader={false} />}>
              <Route path={ROUTES.activityDetails.path} element={<ActivityDetailsPage />} />
              <Route path={ROUTES.publicActivityDetails.path} element={<PublicActivityDetailsPage />} />
            </Route>

            <Route element={<Layout />}>
              <Route path={ROUTES.appletList.path} element={<AppletListPage />} />
              <Route path={ROUTES.appletDetails.path} element={<AppletDetailsPage />} />

              <Route path={ROUTES.profile.path} element={<ProfilePage />} />
              <Route path={ROUTES.settings.path} element={<SettingsPage />} />
              <Route path={ROUTES.invitation.path} element={<InvitationPage />} />
              <Route path={ROUTES.privateJoin.path} element={<PrivateJoinPage />} />
              <Route path={ROUTES.publicJoin.path} element={<PublicJoinPage />} />
              <Route path={ROUTES.invitationAccept.path} element={<InvitationAcceptPage />} />
              <Route path={ROUTES.invitationDecline.path} element={<InvitationDeclinePage />} />
              <Route path={ROUTES.transferOwnership.path} element={<TransferOwnershipPage />} />

              <Route path="*" element={<Navigate to={ROUTES.appletList.path} />} />
            </Route>
          </Route>
        </Routes>
      </LogoutTracker>
    )
  }

  return (
    <Routes>
      <Route element={<Layout bgColor={Theme.colors.light.surface} hasFooter={false} hasHeader={false} />}>
        <Route path={ROUTES.publicActivityDetails.path} element={<PublicActivityDetailsPage />} />
      </Route>

      <Route element={<Layout />}>
        <Route index path={ROUTES.login.path} element={<LoginPage />} />
        <Route path={ROUTES.signup.path} element={<SignupPage />} />
        <Route path={ROUTES.forgotPassword.path} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.changePassword.path} element={<RecoveryPasswordPage />} />
        <Route path={ROUTES.invitation.path} element={<InvitationPage />} />
        <Route path={ROUTES.privateJoin.path} element={<PrivateJoinPage />} />
        <Route path={ROUTES.transferOwnership.path} element={<TransferOwnershipPage />} />

        <Route path={ROUTES.publicJoin.path} element={<PublicJoinPage />} />

        <Route path="*" element={<Navigate to={ROUTES.login.path} />} />
      </Route>
    </Routes>
  )
}

export default ApplicationRouter
