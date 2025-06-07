import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientListComponent } from './components/patients/patient-list.component';
import { PatientFormComponent } from './components/patients/patient-form.component';
import { PatientDetailComponent } from './components/patients/patient-detail.component';
import { AppointmentListComponent } from './components/appointments/appointment-list.component';
import { AppointmentFormComponent } from './components/appointments/appointment-form.component';
import { MedicalRecordListComponent } from './components/medical-records/medical-record-list.component';
import { MedicalRecordFormComponent } from './components/medical-records/medical-record-form.component';
import { StaffListComponent } from './components/staff/staff-list.component';
import { StaffFormComponent } from './components/staff/staff-form.component';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './models/user.model';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: '', 
    redirectTo: '/dashboard', 
    pathMatch: 'full' 
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'patients',
    canActivate: [AuthGuard],
    data: { roles: [Role.ROLE_ADMIN, Role.ROLE_DOCTOR, Role.ROLE_SECRETARY] },
    children: [
      {
        path: '',
        component: PatientListComponent
      },
      {
        path: 'new',
        component: PatientFormComponent
      },
      {
        path: ':id',
        component: PatientDetailComponent
      },
      {
        path: ':id/edit',
        component: PatientFormComponent
      }
    ]
  },
  {
    path: 'appointments',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: AppointmentListComponent
      },
      {
        path: 'new',
        component: AppointmentFormComponent,
        data: { roles: [Role.ROLE_ADMIN, Role.ROLE_DOCTOR, Role.ROLE_SECRETARY] }
      },
      {
        path: ':id/edit',
        component: AppointmentFormComponent,
        data: { roles: [Role.ROLE_ADMIN, Role.ROLE_DOCTOR, Role.ROLE_SECRETARY] }
      }
    ]
  },
  {
    path: 'medical-records',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: MedicalRecordListComponent
      },
      {
        path: 'new',
        component: MedicalRecordFormComponent,
        data: { roles: [Role.ROLE_ADMIN, Role.ROLE_DOCTOR] }
      },
      {
        path: ':id/edit',
        component: MedicalRecordFormComponent,
        data: { roles: [Role.ROLE_ADMIN, Role.ROLE_DOCTOR] }
      }
    ]
  },
  {
    path: 'staff',
    canActivate: [AuthGuard],
    data: { roles: [Role.ROLE_ADMIN] },
    children: [
      {
        path: '',
        component: StaffListComponent
      },
      {
        path: 'new',
        component: StaffFormComponent
      },
      {
        path: ':id/edit',
        component: StaffFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
