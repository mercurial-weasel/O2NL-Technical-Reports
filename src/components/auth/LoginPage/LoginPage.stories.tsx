import type { Meta, StoryObj } from '@storybook/react';
import { LoginPage } from '../LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../lib/auth';

const meta = {
  title: 'Auth/LoginPage',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Authentication page for user login with email and password.'
      }
    }
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </AuthProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default login page state with empty form.'
      }
    }
  }
};

export const WithError: Story = {
  parameters: {
    mockData: {
      error: 'Invalid email or password'
    },
    docs: {
      description: {
        story: 'Login page showing an error message after failed authentication attempt.'
      }
    }
  }
};

export const Loading: Story = {
  parameters: {
    mockData: {
      loading: true
    },
    docs: {
      description: {
        story: 'Login page in loading state while processing authentication.'
      }
    }
  }
};

export const InvalidEmail: Story = {
  parameters: {
    mockData: {
      error: 'Please enter a valid email address'
    },
    docs: {
      description: {
        story: 'Login page showing email validation error.'
      }
    }
  }
};

export const PasswordTooShort: Story = {
  parameters: {
    mockData: {
      error: 'Password must be at least 8 characters long'
    },
    docs: {
      description: {
        story: 'Login page showing password validation error.'
      }
    }
  }
};

export const AccountLocked: Story = {
  parameters: {
    mockData: {
      error: 'Account locked. Please contact support.'
    },
    docs: {
      description: {
        story: 'Login page showing account locked error state.'
      }
    }
  }
};

export const NetworkError: Story = {
  parameters: {
    mockData: {
      error: 'Network error. Please check your connection and try again.'
    },
    docs: {
      description: {
        story: 'Login page showing network connection error.'
      }
    }
  }
};

export const MaintenanceMode: Story = {
  parameters: {
    mockData: {
      error: 'System is under maintenance. Please try again later.',
      maintenance: true
    },
    docs: {
      description: {
        story: 'Login page showing system maintenance message.'
      }
    }
  }
};