import { AuthUser, AccessRight } from './types';
import { logger } from '../logger';

// Mock user data for development
const mockUsers: (AuthUser & { password: string })[] = [
  {
    id: '1',
    email: 'admin@o2nl.nz',
    firstName: 'Dave',
    lastName: 'Braendler',
    password: 'admin123', // In a real app, this would be hashed
    accessRights: ['PAB', 'AMT', 'Design Lead', 'General', 'Admin'],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'design@o2nl.nz',
    firstName: 'Emma',
    lastName: 'Christie',
    password: 'design123',
    accessRights: ['Design Lead', 'General'],
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    email: 'commercial@o2nl.nz',
    firstName: 'Dean',
    lastName: 'Sumner',
    password: 'commercial123',
    accessRights: ['Commercial', 'PAB', 'AMT'],
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    email: 'amt@o2nl.nz',
    firstName: 'AMT',
    lastName: 'Member',
    password: 'amt123',
    accessRights: ['AMT', 'General'],
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    email: 'pab@o2nl.nz',
    firstName: 'PAB',
    lastName: 'Member',
    password: 'pab123',
    accessRights: ['PAB'],
    created_at: new Date().toISOString()
  }
];

// Mock authentication functions
export const mockAuth = {
  signIn: async (email: string, password: string): Promise<AuthUser> => {
    logger.info('Mock auth: attempting sign in', { email });
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      logger.error('Mock auth: user not found', { email });
      throw new Error('Invalid email or password');
    }
    
    // Skip password check if bypass is enabled
    const bypassAuth = import.meta.env.VITE_BYPASS_AUTHENTICATION === 'true';
    logger.info('Mock auth: bypass status', { bypassAuth });

    if (!bypassAuth && user.password !== password) {
      logger.error('Mock auth: invalid password', { email });
      throw new Error('Invalid email or password');
    }
    
    logger.info('Mock auth: sign in successful', { 
      email, 
      accessRights: user.accessRights,
      bypassAuth 
    });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  signOut: async () => {
    logger.info('Mock auth: signing out');
  },

  getCurrentUser: async (): Promise<AuthUser | null> => {
    // Check if bypass is enabled
    const bypassAuth = import.meta.env.VITE_BYPASS_AUTHENTICATION === 'true';
    logger.info('Mock auth: getCurrentUser called', { bypassAuth });
    
    if (bypassAuth) {
      logger.info('Mock auth: bypass enabled - auto-logging as admin');
      const adminUser = mockUsers.find(u => u.email === 'admin@o2nl.nz');
      if (adminUser) {
        const { password: _, ...userWithoutPassword } = adminUser;
        return userWithoutPassword;
      }
    }
    
    logger.info('Mock auth: no current user');
    return null;
  },

  getUserAccessRights: async (userId: string): Promise<AccessRight[]> => {
    const user = mockUsers.find(u => u.id === userId);
    return user?.accessRights || [];
  }
};