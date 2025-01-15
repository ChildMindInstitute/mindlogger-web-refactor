import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import authorizationService from './authorization.service';
import { Any, eventEmitter, getLanguage, secureTokensStorage } from '../../utils';

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
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    return Promise.reject(error);
  },
);

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
        const { data } = await authorizationService.refreshToken({
          refreshToken: tokens?.refreshToken,
        });

        secureTokensStorage.setTokens(data.result);

        if (!config.headers) {
          config.headers = {};
        }

        config.headers.Authorization = `${data.result.tokenType} ${data.result.accessToken}`;
      } catch (e) {
        eventEmitter.emit('onLogout');
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        await Promise.reject(e);
      }

      return axiosService(config);
    }

    return Promise.reject(error);
  },
);

export default axiosService;
