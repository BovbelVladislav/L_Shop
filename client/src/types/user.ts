export type UserRole = 'guest' | 'user' | 'owner' | 'manager';

export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  phone: string;
  role?: UserRole;
  sessionExpiry?: number;
}
