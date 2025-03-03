import type { Meta, StoryObj } from '@storybook/react';
import { ProtectedRoute } from './ProtectedRoute';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../lib/auth';

const meta = {
  title: 'Auth/ProtectedRoute',
  component: ProtectedRoute,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Route wrapper that handles authentication and access control.'
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
  argTypes: {
    children: {
      control: 'text',
      description: 'Protected content'
    },
    requiredAccess: {
      control: 'object',
      description: 'Required access rights array'
    }
  },
} satisfies Meta<typeof ProtectedRoute>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <div className="p-4">Protected Content</div>
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic protected route without specific access requirements.'
      }
    }
  }
};

export const WithRequiredAccess: Story = {
  args: {
    children: <div className="p-4">Admin Only Content</div>,
    requiredAccess: ['Admin']
  },
  parameters: {
    docs: {
      description: {
        story: 'Protected route requiring admin access.'
      }
    }
  }
};

export const MultipleAccessRights: Story = {
  args: {
    children: <div className="p-4">Project Management Content</div>,
    requiredAccess: ['PAB', 'AMT', 'Commercial']
  },
  parameters: {
    docs: {
      description: {
        story: 'Protected route requiring multiple possible access rights.'
      }
    }
  }
};

export const Loading: Story = {
  args: {
    children: <div className="p-4">Protected Content</div>
  },
  parameters: {
    mockData: {
      loading: true
    },
    docs: {
      description: {
        story: 'Protected route in loading state while checking authentication.'
      }
    }
  }
};

export const Unauthorized: Story = {
  args: {
    children: <div className="p-4">Protected Content</div>,
    requiredAccess: ['Admin']
  },
  parameters: {
    mockData: {
      user: {
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        accessRights: ['User'],
        created_at: new Date().toISOString()
      }
    },
    docs: {
      description: {
        story: 'Protected route showing unauthorized access attempt.'
      }
    }
  }
};

export const Authorized: Story = {
  args: {
    children: <div className="p-4">Protected Content</div>,
    requiredAccess: ['Admin']
  },
  parameters: {
    mockData: {
      user: {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        accessRights: ['Admin'],
        created_at: new Date().toISOString()
      }
    },
    docs: {
      description: {
        story: 'Protected route with successful authorization.'
      }
    }
  }
};

export const NestedRoute: Story = {
  args: {
    children: (
      <ProtectedRoute requiredAccess={['Admin']}>
        <div className="p-4">
          <h2>Nested Protected Content</h2>
          <p>This content requires multiple levels of authorization.</p>
        </div>
      </ProtectedRoute>
    ),
    requiredAccess: ['PAB']
  },
  parameters: {
    docs: {
      description: {
        story: 'Nested protected routes with different access requirements.'
      }
    }
  }
};

export const SessionExpired: Story = {
  args: {
    children: <div className="p-4">Protected Content</div>
  },
  parameters: {
    mockData: {
      error: 'Session expired',
      user: null
    },
    docs: {
      description: {
        story: 'Protected route handling expired session.'
      }
    }
  }
};

export const CustomRedirect: Story = {
  args: {
    children: <div className="p-4">Protected Content</div>,
    requiredAccess: ['Admin']
  },
  parameters: {
    mockData: {
      redirectPath: '/custom-login'
    },
    docs: {
      description: {
        story: 'Protected route with custom redirect path.'
      }
    }
  }
};