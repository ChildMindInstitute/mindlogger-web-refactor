/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_ADMIN_PANEL_HOST: string;
  readonly NODE_ENV: string;
  readonly VITE_ENV: 'prod' | 'stage' | 'dev' | 'uat';
  readonly VITE_BUILD_VERSION: string;
  readonly VITE_IV_LENGTH: string;
  readonly VITE_MIXPANEL_TOKEN: string;
  readonly VITE_LAUNCHDARKLY_CLIENT_ID: string;

  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_TRACE_PROPAGATION_TARGETS: string; // List of domains Array<string>

  readonly VITE_DD_CLIENT_TOKEN: string | undefined;
  readonly VITE_DD_APP_ID: string | undefined;
  readonly VITE_DD_VERSION: string | undefined;
  readonly VITE_DD_TRACING_URLS: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
