import { lazy } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import AppletDetailsPage from './AppletDetailsPage';
import AppletListPage from './AppletListPage';
import ProfilePage from './Profile';
import SettingsPage from './Settings';
import SurveyPage from './Survey';

import ROUTES from '~/shared/constants/routes';
import Layout from '~/widgets/AppLayout';
import LogoutTracker from '~/widgets/LogoutTracker';
import ProtectedRoute from '~/widgets/ProtectedRoute';

const PublicSurvey = lazy(() => import('./PublicSurvey'));
const PublicAppletDetailsPage = lazy(() => import('./PublicJoin'));
const InvitationPage = lazy(() => import('./Invitation'));
const PrivateJoinPage = lazy(() => import('./PrivateJoin'));
const TransferOwnershipPage = lazy(() => import('./TransferOwnership'));

type Props = {
  refreshToken: string;
};

function AuthorizedRoutes({ refreshToken }: Props) {
  return (
    <LogoutTracker>
      <Routes>
        <Route element={<ProtectedRoute token={refreshToken} />}>
          <Route path={ROUTES.survey.path} element={<SurveyPage />} />
          <Route path={ROUTES.publicActivityDetails.path} element={<PublicSurvey />} />

          <Route element={<Layout />}>
            <Route path={ROUTES.appletList.path} element={<AppletListPage />} />
            <Route path={ROUTES.appletDetails.path} element={<AppletDetailsPage />} />

            <Route path={ROUTES.profile.path} element={<ProfilePage />} />
            <Route path={ROUTES.settings.path} element={<SettingsPage />} />
            <Route path={ROUTES.invitation.path} element={<InvitationPage />} />
            <Route path={ROUTES.privateJoin.path} element={<PrivateJoinPage />} />
            <Route path={ROUTES.publicJoin.path} element={<PublicAppletDetailsPage />} />
            <Route path={ROUTES.transferOwnership.path} element={<TransferOwnershipPage />} />

            <Route path="*" element={<Navigate to={ROUTES.appletList.path} />} />
          </Route>
        </Route>
      </Routes>
    </LogoutTracker>
  );
}

export default AuthorizedRoutes;
