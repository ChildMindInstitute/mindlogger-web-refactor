/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string
  readonly VITE_ADMIN_PANEL_HOST: string
  readonly NODE_ENV: string
  readonly VITE_ENV: "prod" | "stage" | "dev"
  readonly VITE_BUILD_VERSION: string
  readonly VITE_IV_LENGTH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
