import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MedicalRecord } from '../models/medical-record.model';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private apiUrl = `${environment.apiUrl}/medical-records`;

  constructor(private http: HttpClient) { }

  getAllMedicalRecords(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(this.apiUrl);
  }

  getMedicalRecordById(id: number): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.apiUrl}/${id}`);
  }

  getMedicalRecordByPatientId(patientId: number): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.apiUrl}/patient/${patientId}`);
  }

  createMedicalRecord(record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(this.apiUrl, record);
  }

  updateMedicalRecord(id: number, record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.put<MedicalRecord>(`${this.apiUrl}/${id}`, record);
  }
}
