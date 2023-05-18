/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string
  readonly NODE_ENV: string
  readonly VITE_BUILD_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
