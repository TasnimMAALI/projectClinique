export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW'
}

export interface Appointment {
    id?: number;
    patientId: number;
    patientName?: string;
    doctorId: number;
    doctorName?: string;
    appointmentDateTime: Date;
    reason: string;
    status: AppointmentStatus;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
