import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Staff, StaffCreateRequest } from '../models/staff.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private apiUrl = `${environment.apiUrl}/api/staff`;

  constructor(private http: HttpClient) { }

  getAllStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.apiUrl);
  }

  getAllDoctors(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.apiUrl}/doctors`);
  }

  getAllSecretaries(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.apiUrl}/secretaries`);
  }

  getStaffById(id: number): Observable<Staff> {
    return this.http.get<Staff>(`${this.apiUrl}/${id}`);
  }

  createStaffMember(request: StaffCreateRequest): Observable<Staff> {
    return this.http.post<Staff>(this.apiUrl, request);
  }

  updateStaffMember(id: number, request: StaffCreateRequest): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/${id}`, request);
  }

  deleteStaffMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
