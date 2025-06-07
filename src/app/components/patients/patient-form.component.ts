import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
  patientForm!: FormGroup;
  isEditMode = false;
  patientId?: number;
  loading = false;
  error = '';
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.patientId) {
      this.isEditMode = true;
      this.loadPatient();
    }
  }

  private initForm(): void {
    this.patientForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: [''],
      dateOfBirth: ['', [Validators.required]],
      bloodGroup: [''],
      allergies: [''],
      medicalHistory: [''],
      emergencyContact: [''],
      emergencyPhone: [''],
      insuranceProvider: [''],
      insuranceNumber: ['']
    });
  }

  private loadPatient(): void {
    if (!this.patientId) return;

    this.loading = true;
    this.patientService.getPatientById(this.patientId)
      .subscribe({
        next: (patient) => {
          this.patientForm.patchValue({
            ...patient,
            dateOfBirth: this.formatDate(patient.dateOfBirth)
          });
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Error loading patient';
          this.loading = false;
        }
      });
  }

  private formatDate(date: Date | string): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      return;
    }

    const patientData: Patient = {
      ...this.patientForm.value,
      id: this.patientId
    };

    this.loading = true;
    const request = this.isEditMode ?
      this.patientService.updatePatient(this.patientId!, patientData) :
      this.patientService.createPatient(patientData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/patients']);
      },
      error: (error) => {
        this.error = error.error?.message || 'Error saving patient';
        this.loading = false;
      }
    });
  }
}
