/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_DATA: string;
  readonly VITE_DEBUG_ACCESS_RIGHTS: string;
  readonly VITE_BYPASS_AUTHENTICATION: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
