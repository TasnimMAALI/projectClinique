import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    PatientListComponent,
    PatientFormComponent,
    PatientDetailComponent,
    AppointmentListComponent,
    AppointmentFormComponent,
    MedicalRecordListComponent,
    MedicalRecordFormComponent,
    StaffListComponent,
    StaffFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
