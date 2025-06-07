export enum Role {
  ROLE_PATIENT = 'ROLE_PATIENT',
  ROLE_DOCTOR = 'ROLE_DOCTOR',
  ROLE_SECRETARY = 'ROLE_SECRETARY',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phoneNumber?: string;
  address?: string;
  specialization?: string;
  licenseNumber?: string;
}
