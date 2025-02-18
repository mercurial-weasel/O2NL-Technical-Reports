import { createClient } from '@supabase/supabase-js';
import { AuthUser, UserRole } from './types';
import { logger } from '../logger';

// Initialize Supabase client
//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
//const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

//if (!supabaseUrl || !supabaseKey) {
//  throw new Error('Missing Supabase environment variables');
//}

// const supabase = createClient(supabaseUrl, supabaseKey);

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

      return {
        id: authData.user.id,
        email: authData.user.email!,
        roles: roles.map(r => r.role),
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