// Mock user data
const mockUser = {
  id: 'user_123',
  firstName: 'Demo',
  lastName: 'User',
  fullName: 'Demo User',
  username: 'demouser',
  emailAddresses: [{ emailAddress: 'demo@example.com' }],
  imageUrl: 'https://via.placeholder.com/150',
  hasImage: true,
};

// Simple component mock - just returns children or null
const createComponentMock = (displayName) => {
  const Component = ({ children }) => children || null;
  Component.displayName = displayName;
  return Component;
};

// Define React components as functions that return their children
const ClerkProvider = createComponentMock('ClerkProvider');
const SignedIn = createComponentMock('SignedIn');
const SignedOut = createComponentMock('SignedOut');
const SignIn = createComponentMock('SignIn');
const SignUp = createComponentMock('SignUp');
const SignInButton = createComponentMock('SignInButton');
const SignOutButton = createComponentMock('SignOutButton');
const SignUpButton = createComponentMock('SignUpButton');
const UserButton = createComponentMock('UserButton');
const ClerkLoaded = createComponentMock('ClerkLoaded');
const ClerkLoading = createComponentMock('ClerkLoading');
const UserProvider = createComponentMock('UserProvider');

// Define hooks as functions that return mock data
const useClerk = () => ({
  signOut: () => Promise.resolve(),
  signIn: () => Promise.resolve(),
  session: { id: 'session_123' },
});

const useUser = () => ({
  user: mockUser,
  isLoaded: true,
  isSignedIn: true,
});

const useSession = () => ({
  session: { id: 'session_123', user: mockUser },
  isLoaded: true,
  isSignedIn: true,
});

const useAuth = () => ({
  isLoaded: true,
  isSignedIn: true,
  userId: 'user_123',
  sessionId: 'session_123',
  getToken: () => Promise.resolve('mock-token'),
  signOut: () => Promise.resolve(),
});

// Named exports for all components and hooks
export {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  ClerkLoaded,
  ClerkLoading,
  UserProvider,
  useClerk,
  useUser,
  useSession,
  useAuth
};

// Default export for module imports
export default {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  ClerkLoaded,
  ClerkLoading,
  UserProvider,
  useClerk,
  useUser,
  useSession,
  useAuth
};
