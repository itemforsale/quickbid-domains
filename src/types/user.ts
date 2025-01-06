export interface User {
  id: string;
  username: string;
  email: string;
  xUsername?: string;
  isAdmin?: boolean;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  xUsername?: string;
}