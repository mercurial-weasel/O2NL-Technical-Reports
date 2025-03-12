import { mockModuleResolver } from './mockModuleResolver';

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-themes',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag',
  },
  // Keep the webpack alias configuration for Clerk mock
  viteFinal: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@clerk/clerk-react': require.resolve('./__mocks__/clerk-mock.js'),
    };

    // Add the module resolver plugin to Vite
    config.plugins = config.plugins || [];
    config.plugins.push({
      name: 'clerk-mock-resolver',
      resolveId(id) {
        if (id === '@clerk/clerk-react') {
          return id;
        }
        return null;
      },
      load(id) {
        if (id === '@clerk/clerk-react') {
          return `
            const createComponentMock = (displayName) => {
              const Component = ({ children }) => children || null;
              Component.displayName = displayName;
              return Component;
            };

            // Define React components using the factory
            export const ClerkProvider = createComponentMock('ClerkProvider');
            export const SignedIn = createComponentMock('SignedIn');
            export const SignedOut = createComponentMock('SignedOut');
            export const SignIn = createComponentMock('SignIn');
            export const SignUp = createComponentMock('SignUp');
            export const SignInButton = createComponentMock('SignInButton');
            export const SignOutButton = createComponentMock('SignOutButton');
            export const SignUpButton = createComponentMock('SignUpButton');
            export const UserButton = createComponentMock('UserButton');
            export const ClerkLoaded = createComponentMock('ClerkLoaded');
            export const ClerkLoading = createComponentMock('ClerkLoading');
            export const UserProvider = createComponentMock('UserProvider');

            // Mock user data
            const mockUser = {
              id: 'user_123',
              firstName: 'Demo',
              lastName: 'User',
              fullName: 'Demo User',
              emailAddresses: [{ emailAddress: 'demo@example.com' }],
              imageUrl: 'https://via.placeholder.com/150',
              hasImage: true,
            };

            // Define hooks
            export const useClerk = () => ({
              signOut: () => Promise.resolve(),
              signIn: () => Promise.resolve(),
            });

            export const useUser = () => ({
              user: mockUser,
              isLoaded: true,
              isSignedIn: true,
            });

            export const useSession = () => ({
              session: { id: 'session_123', user: mockUser },
              isLoaded: true,
              isSignedIn: true,
            });

            export const useAuth = () => ({
              isLoaded: true,
              isSignedIn: true,
              userId: 'user_123',
              sessionId: 'session_123',
              getToken: () => Promise.resolve('mock-token'),
              signOut: () => Promise.resolve(),
            });

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
          `;
        }
        return null;
      }
    });
    return config;
  },
};

export default config;