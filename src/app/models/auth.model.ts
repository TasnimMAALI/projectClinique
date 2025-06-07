import { Role } from './user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  phoneNumber?: string;
  address?: string;
  specialization?: string;
  licenseNumber?: string;
}

export interface AuthResponse {
  id: number;
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
