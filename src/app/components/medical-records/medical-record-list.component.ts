import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicalRecordService } from '../../services/medical-record.service';
import { AuthService } from '../../services/auth.service';
import { MedicalRecord } from '../../models/medical-record.model';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-medical-record-list',
  templateUrl: './medical-record-list.component.html',
  styleUrls: ['./medical-record-list.component.scss']
})
export class MedicalRecordListComponent implements OnInit {
  medicalRecords: MedicalRecord[] = [];
  loading = false;
  error = '';
  currentUser$ = this.authService.currentUser;

  constructor(
    private medicalRecordService: MedicalRecordService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMedicalRecords();
  }

  private async loadMedicalRecords(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      const user = this.authService.currentUserValue;
      
      if (!user) {
        this.error = 'User not authenticated';
        return;
      }

      switch (user.role) {
        case Role.ROLE_PATIENT:
          const patientRecord = await this.medicalRecordService.getMedicalRecordByPatientId(user.id).toPromise();
          this.medicalRecords = patientRecord ? [patientRecord] : [];
          break;
        case Role.ROLE_DOCTOR:
        case Role.ROLE_ADMIN:
          const allRecords = await this.medicalRecordService.getAllMedicalRecords().toPromise();
          this.medicalRecords = allRecords || [];
          break;
        default:
          this.error = 'Invalid user role';
      }
    } catch (error) {
      this.error = `Error loading medical records: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }

  createMedicalRecord(): void {
    this.router.navigate(['/medical-records/new']);
  }

  editMedicalRecord(id: number): void {
    this.router.navigate(['/medical-records', id, 'edit']);
  }

  viewMedicalRecord(id: number): void {
    this.router.navigate(['/medical-records', id]);
  }
}
