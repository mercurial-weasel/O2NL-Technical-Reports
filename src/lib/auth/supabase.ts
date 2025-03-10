import { createClient } from '@supabase/supabase-js';
import { AuthUser, UserRole, AccessRight } from './types';
import { logger } from '../logger';

// Create a dummy client when not actually using Supabase
// This prevents "supabase is not defined" errors when the code path might reach here
// but we're actually using mock authentication
const createDummyClient = () => {
  logger.warn('Creating dummy Supabase client - this should only happen in development');
  return {
    auth: {
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: async () => ({ data: [], error: null }),
      }),
    }),
  };
};

// Initialize Supabase client only if we're not using mock data
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
let supabase;

if (!useMockData) {
  // Only try to connect to Supabase if we're not using mock data
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    logger.info('Supabase client initialized');
  } else {
    logger.warn('Missing Supabase environment variables');
    supabase = createDummyClient();
  }
} else {
  // Use dummy client if we're using mock data
  supabase = createDummyClient();
}

export const supabaseAuth = {
  signIn: async (email: string, password: string): Promise<AuthUser> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from auth');

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id);

      if (rolesError) throw rolesError;

      const accessRights = roles.map(r => r.role) as AccessRight[];

      return {
        id: authData.user.id,
        email: authData.user.email!,
        firstName: '', // These fields need to be populated from profile data
        lastName: '',  // These fields need to be populated from profile data
        accessRights,
        created_at: authData.user.created_at
      };
    } catch (error) {
      logger.error('Sign in failed', { error });
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      logger.error('Sign out failed', { error });
      throw error;
    }
  },

  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      if (!user) return null;

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (rolesError) throw rolesError;

      return {
        id: user.id,
        email: user.email!,
        roles: roles.map(r => r.role),
        created_at: user.created_at
      };
    } catch (error) {
      logger.error('Get current user failed', { error });
      throw error;
    }
  },

  getUserRoles: async (userId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;
      return data.map(r => r.role);
    } catch (error) {
      logger.error('Get user roles failed', { error });
      throw error;
    }
  }
};