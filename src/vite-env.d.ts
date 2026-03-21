/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_PUBLIC_APP_URL?: string;
  readonly VITE_ENABLE_DEMO_PAYMENT_FALLBACK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
