import { lazy } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import ForgotPasswordPage from './ForgotPassword';
import LoginPage from './Login';
import PublicSurveyAnswerProcessing from './PublicSurveyAnswerProcessing';
import SignupPage from './Signup';

import AppletDetailsPage from '~/pages/AppletDetailsPage';
import ROUTES from '~/shared/constants/routes';
import Layout from '~/widgets/AppLayout';

const PublicAppletDetailsPage = lazy(() => import('./PublicJoin'));
const PublicSurvey = lazy(() => import('./PublicSurvey'));
const RecoveryPasswordPage = lazy(() => import('./RecoveryPassword'));
const InvitationPage = lazy(() => import('./Invitation'));
const PrivateJoinPage = lazy(() => import('./PrivateJoin'));
const TransferOwnershipPage = lazy(() => import('./TransferOwnership'));

function UnauthorizedRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.publicSurvey.path} element={<PublicSurvey />} />
      <Route path={ROUTES.publicAnswerProcessing.path} element={<PublicSurveyAnswerProcessing />} />

      <Route element={<Layout />}>
        <Route path={ROUTES.appletDetails.path} element={<AppletDetailsPage />} />
        <Route index path={ROUTES.login.path} element={<LoginPage />} />
        <Route path={ROUTES.signup.path} element={<SignupPage />} />
        <Route path={ROUTES.forgotPassword.path} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.changePassword.path} element={<RecoveryPasswordPage />} />
        <Route path={ROUTES.invitation.path} element={<InvitationPage />} />
        <Route path={ROUTES.privateJoin.path} element={<PrivateJoinPage />} />
        <Route path={ROUTES.transferOwnership.path} element={<TransferOwnershipPage />} />

        <Route path={ROUTES.publicJoin.path} element={<PublicAppletDetailsPage />} />

        <Route path="*" element={<Navigate to={ROUTES.login.path} />} />
      </Route>
    </Routes>
  );
}

export default UnauthorizedRoutes;
