import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalRecordService } from '../../services/medical-record.service';
import { AuthService } from '../../services/auth.service';
import { MedicalRecord } from '../../models/medical-record.model';

@Component({
  selector: 'app-medical-record-form',
  templateUrl: './medical-record-form.component.html',
  styleUrls: ['./medical-record-form.component.scss']
})
export class MedicalRecordFormComponent implements OnInit {
  medicalRecordForm: FormGroup;
  loading = false;
  error = '';
  isEdit = false;
  recordId?: number;

  constructor(
    private fb: FormBuilder,
    private medicalRecordService: MedicalRecordService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.medicalRecordForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      diagnosis: ['', [Validators.required, Validators.maxLength(1000)]],
      prescription: ['', [Validators.required, Validators.maxLength(1000)]],
      treatmentPlan: ['', [Validators.required, Validators.maxLength(1000)]],
      notes: ['', Validators.maxLength(1000)]
    });
  }

  ngOnInit(): void {
    this.recordId = this.route.snapshot.params['id'];
    if (this.recordId) {
      this.isEdit = true;
      this.loadMedicalRecord();
    }
  }

  private async loadMedicalRecord(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      const record = await this.medicalRecordService.getMedicalRecordById(this.recordId!).toPromise();
      if (record) {
        this.medicalRecordForm.patchValue({
          patientId: record.patientId,
          doctorId: record.doctorId,
          diagnosis: record.diagnosis,
          prescription: record.prescription,
          treatmentPlan: record.treatmentPlan,
          notes: record.notes
        });
      } else {
        this.error = 'Medical record not found';
      }
    } catch (error) {
      this.error = `Error loading medical record: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.medicalRecordForm.invalid) {
      return;
    }

    try {
      this.loading = true;
      this.error = '';
      const record: MedicalRecord = this.medicalRecordForm.value;

      if (this.isEdit) {
        await this.medicalRecordService.updateMedicalRecord(this.recordId!, record).toPromise();
      } else {
        await this.medicalRecordService.createMedicalRecord(record).toPromise();
      }

      this.router.navigate(['/medical-records']);
    } catch (error) {
      this.error = `Error ${this.isEdit ? 'updating' : 'creating'} medical record: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/medical-records']);
  }
}
