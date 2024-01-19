import { lazy } from "react"

import { Navigate, Route, Routes } from "react-router-dom"

import { AppletListPage } from "./AppletListPage"
import { LoginPage } from "./Login"
import { SettingsPage } from "./Settings"
import { SignupPage } from "./Signup"

// Lazy load pages
const AppletDetailsPage = lazy(() => import("./AppletDetailsPage"))
const PublicAppeltDetailsPage = lazy(() => import("./PublicJoin"))

const ActivityDetailsPage = lazy(() => import("./ActivityDetails"))
const PublicActivityDetailsPage = lazy(() => import("./PublicActivityDetails"))

const ProfilePage = lazy(() => import("./Profile"))

const ForgotPasswordPage = lazy(() => import("./ForgotPassword"))

const InvitationPage = lazy(() => import("./Invitation"))
const PrivateJoinPage = lazy(() => import("./PrivateJoin"))
const TransferOwnershipPage = lazy(() => import("./TransferOwnership"))
const RecoveryPasswordPage = lazy(() => import("./RecoveryPassword"))

import { userModel } from "~/entities/user"
import { ROUTES } from "~/shared/constants"
import Layout from "~/widgets/AppLayout"
import { LogoutTracker } from "~/widgets/LogoutTracker"
import { ProtectedRoute } from "~/widgets/ProtectedRoute"

const ApplicationRouter = (): JSX.Element | null => {
  const { isAuthorized, tokens } = userModel.hooks.useAuthorization()

  if (isAuthorized) {
    return (
      <LogoutTracker>
        <Routes>
          <Route element={<ProtectedRoute token={tokens.refreshToken} />}>
            <Route path={ROUTES.activityDetails.path} element={<ActivityDetailsPage />} />
            <Route path={ROUTES.publicActivityDetails.path} element={<PublicActivityDetailsPage />} />

            <Route element={<Layout />}>
              <Route path={ROUTES.appletList.path} element={<AppletListPage />} />
              <Route path={ROUTES.appletDetails.path} element={<AppletDetailsPage />} />

              <Route path={ROUTES.profile.path} element={<ProfilePage />} />
              <Route path={ROUTES.settings.path} element={<SettingsPage />} />
              <Route path={ROUTES.invitation.path} element={<InvitationPage />} />
              <Route path={ROUTES.privateJoin.path} element={<PrivateJoinPage />} />
              <Route path={ROUTES.publicJoin.path} element={<PublicAppeltDetailsPage />} />
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
      <Route path={ROUTES.publicActivityDetails.path} element={<PublicActivityDetailsPage />} />

      <Route element={<Layout />}>
        <Route index path={ROUTES.login.path} element={<LoginPage />} />
        <Route path={ROUTES.signup.path} element={<SignupPage />} />
        <Route path={ROUTES.forgotPassword.path} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.changePassword.path} element={<RecoveryPasswordPage />} />
        <Route path={ROUTES.invitation.path} element={<InvitationPage />} />
        <Route path={ROUTES.privateJoin.path} element={<PrivateJoinPage />} />
        <Route path={ROUTES.transferOwnership.path} element={<TransferOwnershipPage />} />

        <Route path={ROUTES.publicJoin.path} element={<PublicAppeltDetailsPage />} />

        <Route path="*" element={<Navigate to={ROUTES.login.path} />} />
      </Route>
    </Routes>
  )
}

export default ApplicationRouter
