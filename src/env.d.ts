/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string
  readonly NODE_ENV: string
  readonly VITE_IV_LENGTH: number
  readonly VITE_AES_PRIVATE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
