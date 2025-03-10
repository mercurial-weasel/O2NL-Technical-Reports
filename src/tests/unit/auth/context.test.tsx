import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@lib/auth/context';
import { mockAuth } from '@lib/auth/mock';

// Mock the auth implementation
vi.mock('../../../lib/auth/mock', () => ({
  mockAuth: {
    getCurrentUser: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn()
  }
}));

// Test component that uses auth context
function TestComponent() {
  const { state, signIn, signOut } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{state.loading.toString()}</div>
      <div data-testid="user">{state.user?.email || 'no user'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}

describe('AuthProvider', () => {
  it('should initialize with loading state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('loading').textContent).toBe('true');
  });

  it('should handle successful sign in', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      accessRights: ['Admin'],
      created_at: new Date().toISOString()
    };

    vi.mocked(mockAuth.signIn).mockResolvedValueOnce(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(mockAuth.signIn).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });

  it('should handle sign out', async () => {
    vi.mocked(mockAuth.signOut).mockResolvedValueOnce();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Sign Out'));

    await waitFor(() => {
      expect(mockAuth.signOut).toHaveBeenCalled();
      expect(screen.getByTestId('user').textContent).toBe('no user');
    });
  });
});