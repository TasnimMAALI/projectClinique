export interface Patient {
    id?: number;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth: Date;
    bloodGroup?: string;
    allergies?: string;
    medicalHistory?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
    insuranceProvider?: string;
    insuranceNumber?: string;
    createdAt?: Date;
}
