import { Navigate, useLocation } from 'react-router-dom';

import { userModel } from '~/entities/user';
import ROUTES from '~/shared/constants/routes';
import { getSessionReturnPath } from '~/shared/utils';

// Where a signed-in tab belongs when the URL is not one of the app's own: a bookmark, a typed
// address, the back button. It is also reached for a single render in the middle of signing in —
// the user is set a commit before the navigation lands, so the tree swaps while the URL still names
// the login page. Resolving the same destination the sign-in was already heading for is what keeps
// that render from sending the user somewhere else.
function RedirectIntoApp() {
  const location = useLocation();
  const { user } = userModel.hooks.useUserState();

  const { backRedirectPath } = (location.state ?? {}) as { backRedirectPath?: string };
  const to = backRedirectPath ?? getSessionReturnPath(user.id) ?? ROUTES.appletList.path;

  return <Navigate to={to} replace />;
}

export default RedirectIntoApp;
