export interface MedicalRecord {
    id?: number;
    patientId: number;
    patientName?: string;
    doctorId: number;
    doctorName?: string;
    diagnosis: string;
    prescription: string;
    treatmentPlan: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
