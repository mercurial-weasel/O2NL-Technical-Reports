/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_DATA: string;
  readonly VITE_DEBUG_ACCESS_RIGHTS: string;
  readonly VITE_BYPASS_AUTHENTICATION: string;
  readonly VITE_DATABASE_SELECTION: string;
  
  // Dev database variables
  readonly VITE_DEV_SUPABASE_URL: string;
  readonly VITE_DEV_SUPABASE_ANON_KEY: string;
  readonly VITE_DEV_SUPABASE_SERVICE_KEY: string;
  readonly VITE_DEV_DATABASE_URL: string;
  readonly VITE_DEV_DIRECT_URL: string;
  
  // Prod database variables
  readonly VITE_PROD_SUPABASE_URL: string;
  readonly VITE_PROD_SUPABASE_ANON_KEY: string;
  readonly VITE_PROD_SUPABASE_SERVICE_KEY: string;
  readonly VITE_PROD_DATABASE_URL: string;
  readonly VITE_PROD_DIRECT_URL: string;
  
  // Legacy variables (keeping for backward compatibility)
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
