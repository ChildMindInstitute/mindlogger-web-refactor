import { useSessionKeepAlive } from './lib/useSessionKeepAlive';

// Renders nothing. It exists so the engine sits inside the router, which useLogout depends on.
export const SessionKeepAlive = () => {
  useSessionKeepAlive();

  return null;
};
