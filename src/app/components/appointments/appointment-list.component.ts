import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Appointment, AppointmentStatus } from '../../models/appointment.model';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = false;
  error = '';
  currentUser$ = this.authService.currentUser;
  AppointmentStatus = AppointmentStatus;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  private async loadAppointments(): Promise<void> {
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
          const patientAppointments = await this.appointmentService.getAppointmentsByPatientId(user.id).toPromise();
          this.appointments = patientAppointments || [];
          break;
        case Role.ROLE_DOCTOR:
          const doctorAppointments = await this.appointmentService.getAppointmentsByDoctorId(user.id).toPromise();
          this.appointments = doctorAppointments || [];
          break;
        case Role.ROLE_ADMIN:
        case Role.ROLE_SECRETARY:
          const allAppointments = await this.appointmentService.getAllAppointments().toPromise();
          this.appointments = allAppointments || [];
          break;
        default:
          this.error = 'Invalid user role';
      }
    } catch (error) {
      this.error = `Error loading appointments: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }

  async updateStatus(appointment: Appointment, status: AppointmentStatus): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      await this.appointmentService.updateAppointment(appointment.id!, {
        ...appointment,
        status
      }).toPromise();
      await this.loadAppointments();
    } catch (error) {
      this.error = `Error updating appointment: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }

  async deleteAppointment(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      this.loading = true;
      this.error = '';
      await this.appointmentService.deleteAppointment(id).toPromise();
      await this.loadAppointments();
    } catch (error) {
      this.error = `Error deleting appointment: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }

  createAppointment(): void {
    this.router.navigate(['/appointments/new']);
  }

  editAppointment(id: number): void {
    this.router.navigate(['/appointments', id, 'edit']);
  }

  viewAppointment(id: number): void {
    this.router.navigate(['/appointments', id]);
  }
}
