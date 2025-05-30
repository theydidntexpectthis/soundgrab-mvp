/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_EXTERNAL_APIS: string
  readonly VITE_RAPIDAPI_KEY: string
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
