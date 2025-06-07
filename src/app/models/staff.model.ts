import { Role } from './user.model';

export interface Staff {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    role: Role;
    specialization?: string;  // For doctors
    licenseNumber?: string;   // For doctors
    department?: string;      // For secretaries/nurses
    position?: string;        // For secretaries/nurses
}

export interface StaffCreateRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    role: Role;
    specialization?: string;
    licenseNumber?: string;
    department?: string;
    position?: string;
}
