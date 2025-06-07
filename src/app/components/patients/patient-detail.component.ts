import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {
  patient?: Patient;
  loading = false;
  error = '';

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadPatient(id);
    }
  }

  private loadPatient(id: number): void {
    this.loading = true;
    this.patientService.getPatientById(id)
      .subscribe({
        next: (patient) => {
          this.patient = patient;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Error loading patient details';
          this.loading = false;
        }
      });
  }

  onEdit(): void {
    this.router.navigate(['/patients', this.patient?.id, 'edit']);
  }

  onDelete(): void {
    if (!this.patient?.id || !confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    this.loading = true;
    this.patientService.deletePatient(this.patient.id)
      .subscribe({
        next: () => {
          this.router.navigate(['/patients']);
        },
        error: (error) => {
          this.error = error.error?.message || 'Error deleting patient';
          this.loading = false;
        }
      });
  }
}
