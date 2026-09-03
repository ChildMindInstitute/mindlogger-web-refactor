import { lazy } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import AppletDetailsPage from './AppletDetailsPage';
import AppletListPage from './AppletListPage';
import AutoCompletion from './AutoCompletion';
import ProfilePage from './Profile';
import PublicAutoCompletion from './PublicAutoCompletion';
import SettingsPage from './Settings';
import SurveyPage from './Survey';

import Layout from '~/abstract/ui/AppLayout';
import EHRRedirectInterstitialPage from '~/pages/EHRRedirectInterstitial';
import ROUTES from '~/shared/constants/routes';
import Footer from '~/widgets/Footer';
import Header from '~/widgets/Header';
import LogoutTracker from '~/widgets/LogoutTracker';
import ProtectedRoute from '~/widgets/ProtectedRoute';

const PublicSurvey = lazy(() => import('./PublicSurvey'));
const PublicAppletDetailsPage = lazy(() => import('./PublicJoin'));
const InvitationPage = lazy(() => import('./Invitation'));
const PrivateJoinPage = lazy(() => import('./PrivateJoin'));
const TransferOwnershipPage = lazy(() => import('./TransferOwnership'));
const NavigateToActiveAssessment = lazy(() => import('./NavigateToActiveAssessment'));

type Props = {
  refreshToken: string;
};

function AuthorizedRoutes({ refreshToken }: Props) {
  return (
    <LogoutTracker>
      <Routes>
        <Route element={<ProtectedRoute token={refreshToken} />}>
          <Route path={ROUTES.survey.path} element={<SurveyPage />} />
          <Route path={ROUTES.publicSurvey.path} element={<PublicSurvey />} />
          <Route path={ROUTES.activeAssessment.path} element={<NavigateToActiveAssessment />} />

          <Route path={ROUTES.autoCompletion.path} element={<AutoCompletion />} />
          <Route path={ROUTES.publicAutoCompletion.path} element={<PublicAutoCompletion />} />

          <Route element={<Layout header={<Header />} footer={<Footer />} />}>
            <Route path={ROUTES.appletList.path} element={<AppletListPage />} />
            <Route path={ROUTES.appletDetails.path} element={<AppletDetailsPage />} />

            <Route path={ROUTES.profile.path} element={<ProfilePage />} />
            <Route path={ROUTES.settings.path} element={<SettingsPage />} />
            <Route path={ROUTES.invitation.path} element={<InvitationPage />} />
            <Route path={ROUTES.privateJoin.path} element={<PrivateJoinPage />} />
            <Route path={ROUTES.publicJoin.path} element={<PublicAppletDetailsPage />} />
            <Route path={ROUTES.transferOwnership.path} element={<TransferOwnershipPage />} />
          </Route>
          <Route element={<Layout header={<Header />} showBanners={false} />}>
            <Route
              path={ROUTES.ehrRedirectInterstitial.path}
              element={<EHRRedirectInterstitialPage />}
            />
          </Route>
        </Route>
        {/* Signing in navigates before this ever renders, so reaching the login route while
            authorized means arriving at it from outside: a bookmark, a typed URL, the back button. */}
        <Route
          path={ROUTES.login.path}
          element={<Navigate to={ROUTES.appletList.path} replace />}
        />
        <Route path="*" element={<Navigate to={ROUTES.appletList.path} replace />} />
      </Routes>
    </LogoutTracker>
  );
}

export default AuthorizedRoutes;
