import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, AuthUser } from './types';
import { mockAuth } from './mock';
import { supabaseAuth } from './supabase';
import { API_CONFIG } from '../../data/config/api';
import { logger } from '../logger';

// Create context
const AuthContext = createContext<{
  state: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
} | null>(null);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  const auth = API_CONFIG.useMockData ? mockAuth : supabaseAuth;

  useEffect(() => {
    const initAuth = async () => {
      const bypassAuth = import.meta.env.VITE_BYPASS_AUTHENTICATION === 'true';
      logger.info('Initializing authentication', { bypassAuth });

      try {
        // If bypass is enabled, automatically authenticate as admin
        if (bypassAuth) {
          logger.info('Auth bypass enabled - attempting auto-login as admin');
          const adminUser = await auth.signIn('admin@o2nl.nz', 'admin123');
          logger.info('Auth bypass successful', { email: adminUser.email });
          setState({ user: adminUser, loading: false, error: null });
          return;
        }

        // Normal authentication flow
        const user = await auth.getCurrentUser();
        logger.info('Auth initialization complete', { 
          authenticated: !!user,
          useMockData: API_CONFIG.useMockData 
        });
        setState({ user, loading: false, error: null });
      } catch (error) {
        logger.error('Auth initialization failed', { error });
        setState({ 
          user: null, 
          error: error instanceof Error ? error : new Error('Auth initialization failed'),
          loading: false 
        });
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const user = await auth.signIn(email, password);
      logger.info('User signed in successfully', { email });
      setState({ user, loading: false, error: null });
    } catch (error) {
      logger.error('Sign in failed', { error, email });
      setState({ 
        user: null, 
        error: error instanceof Error ? error : new Error('Sign in failed'),
        loading: false 
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await auth.signOut();
      logger.info('User signed out successfully');
      setState({ user: null, loading: false, error: null });
    } catch (error) {
      logger.error('Sign out failed', { error });
      setState({ 
        user: state.user, 
        error: error instanceof Error ? error : new Error('Sign out failed'),
        loading: false 
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}