import { Role } from './user.model';

export interface AuthResponse {
    id: number;
    token: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
}
