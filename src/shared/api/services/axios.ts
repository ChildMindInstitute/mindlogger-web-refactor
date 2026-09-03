import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import authorizationService from './authorization.service';
import {
  Any,
  eventEmitter,
  getLanguage,
  getSessionId,
  publishSessionMessage,
  secureTokensStorage,
} from '../../utils';

type RequestConfig = AxiosRequestConfig<Any> & {
  retry?: boolean;
};

const axiosService = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
});

axiosService.defaults.headers.common['Content-Type'] = 'application/json';
axiosService.defaults.headers.common['Mindlogger-Content-Source'] = 'web';

axiosService.interceptors.request.use(
  (config) => {
    const tokens = secureTokensStorage.getTokens();

    if (tokens?.accessToken && tokens?.tokenType) {
      config.headers.Authorization = `${tokens.tokenType} ${tokens.accessToken}`;
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    config.headers['X-Timezone'] = timezone ?? 'Timezone not found';

    const language = getLanguage();
    config.headers['Content-Language'] = language ?? 'en';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const requestNewTokens = async () => {
  const tokens = secureTokensStorage.getTokens();

  if (!tokens?.refreshToken) {
    throw new Error('No refresh token to refresh with.');
  }

  const { data } = await authorizationService.refreshToken({
    refreshToken: tokens.refreshToken,
  });

  // A logout landed while this was in flight, so storing would put the session back on its feet.
  if (!secureTokensStorage.getTokens()?.refreshToken) {
    throw new Error('Session ended before the refreshed token could be stored.');
  }

  // Read before the tokens change, since siblings identify by the one they still hold.
  const sessionId = getSessionId();

  secureTokensStorage.setTokens(data.result);

  if (sessionId) {
    const { accessToken, refreshToken } = data.result;

    publishSessionMessage({
      type: 'TOKENS_UPDATED',
      payload: { sessionId, accessToken, refreshToken },
    });
  }

  return data.result;
};

let pendingRefresh: ReturnType<typeof requestNewTokens> | null = null;

// Callers that overlap share one request instead of each rotating the token separately. Under
// refresh-token rotation the second rotation would be spending a token the first already retired.
export const refreshTokens = () => {
  if (!pendingRefresh) {
    pendingRefresh = requestNewTokens().finally(() => {
      pendingRefresh = null;
    });
  }

  return pendingRefresh;
};

axiosService.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error?.config as RequestConfig;

    if (error.response?.status === 401 && !config?.retry) {
      config.retry = true;

      const tokens = secureTokensStorage.getTokens();

      if (!tokens?.refreshToken || !tokens.tokenType) {
        return Promise.reject(error);
      }

      try {
        const result = await refreshTokens();

        if (!config.headers) {
          config.headers = {};
        }

        config.headers.Authorization = `${result.tokenType} ${result.accessToken}`;
      } catch (e) {
        // Skip global logout for MFA endpoints - they handle errors in the MFA flow
        const url = config?.url || '';
        const isMFAEndpoint = url.includes('/auth/mfa/');

        if (!isMFAEndpoint) {
          eventEmitter.emit('onLogout');
        }

        await Promise.reject(e);
      }

      return axiosService(config);
    }

    return Promise.reject(error);
  },
);

export default axiosService;
