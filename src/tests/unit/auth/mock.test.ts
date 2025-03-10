import { describe, it, expect } from 'vitest';
import { mockAuth } from '@lib/auth/mock';

describe('Mock Auth', () => {
  it('should successfully sign in with valid credentials', async () => {
    const email = 'admin@o2nl.nz';
    const password = 'admin123';
    
    const user = await mockAuth.signIn(email, password);
    
    expect(user).toBeDefined();
    expect(user.email).toBe(email);
    expect(user.accessRights).toContain('Admin');
  });

  it('should throw error with invalid credentials', async () => {
    const email = 'invalid@o2nl.nz';
    const password = 'wrongpassword';
    
    await expect(mockAuth.signIn(email, password))
      .rejects
      .toThrow('Invalid email or password');
  });

  it('should sign out successfully', async () => {
    await expect(mockAuth.signOut()).resolves.toBeUndefined();
  });
});