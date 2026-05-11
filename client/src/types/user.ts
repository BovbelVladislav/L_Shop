export interface User {
  id: number;
  name: string;
  email: string;
  login: string;
  phone: string;
}
export interface AuthResponse {
  message: string;
  user: User;
}