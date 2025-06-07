import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Appointment, AppointmentStatus } from '../../models/appointment.model';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  loading = false;
  error = '';
  isEdit = false;
  appointmentId?: number;
  statuses = Object.values(AppointmentStatus);

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      appointmentDateTime: ['', Validators.required],
      reason: ['', [Validators.required, Validators.maxLength(500)]],
      status: [AppointmentStatus.SCHEDULED],
      notes: ['', Validators.maxLength(1000)]
    });
  }

  ngOnInit(): void {
    this.appointmentId = this.route.snapshot.params['id'];
    if (this.appointmentId) {
      this.isEdit = true;
      this.loadAppointment();
    }
  }

  private async loadAppointment(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      const appointment = await this.appointmentService.getAppointmentById(this.appointmentId!).toPromise();
      if (!appointment) {
        throw new Error('Appointment not found');
      }
      this.appointmentForm.patchValue({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        appointmentDateTime: appointment.appointmentDateTime,
        reason: appointment.reason,
        status: appointment.status,
        notes: appointment.notes
      });
    } catch (error) {
      this.error = `Error loading appointment: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.appointmentForm.invalid) {
      return;
    }

    try {
      this.loading = true;
      this.error = '';
      const appointment: Appointment = this.appointmentForm.value;

      if (this.isEdit) {
        await this.appointmentService.updateAppointment(this.appointmentId!, appointment).toPromise();
      } else {
        await this.appointmentService.createAppointment(appointment).toPromise();
      }

      this.router.navigate(['/appointments']);
    } catch (error) {
      this.error = `Error ${this.isEdit ? 'updating' : 'creating'} appointment: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/appointments']);
  }
}
