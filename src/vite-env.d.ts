/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_CORE_API_URL: string;
  readonly VITE_APPLICANTS_MOCK_SERVICE_API_URL: string;
  readonly VITE_TICKETS_PROCCESSOR_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
