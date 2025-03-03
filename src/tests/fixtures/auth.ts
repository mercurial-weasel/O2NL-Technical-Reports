import { AuthUser } from '../../lib/auth/types';

export const mockUsers: AuthUser[] = [
  {
    id: '1',
    email: 'admin@o2nl.nz',
    firstName: 'Dave',
    lastName: 'Braendler',
    accessRights: ['PAB', 'AMT', 'Design Lead', 'General', 'Admin'],
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    email: 'design@o2nl.nz',
    firstName: 'Emma',
    lastName: 'Christie',
    accessRights: ['Design Lead', 'General'],
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    email: 'commercial@o2nl.nz',
    firstName: 'Dean',
    lastName: 'Sumner',
    accessRights: ['Commercial', 'PAB', 'AMT'],
    created_at: '2025-01-01T00:00:00.000Z'
  }
];

export const mockAuthState = {
  user: mockUsers[0],
  loading: false,
  error: null
};