import { z } from 'zod';

export const AccessRight = z.enum(['PAB', 'AMT', 'Commercial', 'Admin', 'Design Lead', 'P+C']);
export type AccessRight = z.infer<typeof AccessRight>;

export const UserRoleSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  access_rights: z.array(AccessRight),
  first_name: z.string(),
  last_name: z.string(),
  created_at: z.string(),
  updated_at: z.string().optional()
});

export type UserRole = z.infer<typeof UserRoleSchema>;

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accessRights: AccessRight[];
  created_at: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
}