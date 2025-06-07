import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  error = '';
  roles = Object.values(Role);
  showDoctorFields = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]],
      role: ['ROLE_PATIENT', Validators.required],
      phoneNumber: ['', [Validators.pattern('^[0-9]{10}$')]],
      address: [''],
      specialization: [''],
      licenseNumber: ['']
    });

    // Subscribe to role changes to show/hide doctor fields
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.showDoctorFields = role === Role.ROLE_DOCTOR;
      if (this.showDoctorFields) {
        this.registerForm.get('specialization')?.setValidators(Validators.required);
        this.registerForm.get('licenseNumber')?.setValidators(Validators.required);
      } else {
        this.registerForm.get('specialization')?.clearValidators();
        this.registerForm.get('licenseNumber')?.clearValidators();
      }
      this.registerForm.get('specialization')?.updateValueAndValidity();
      this.registerForm.get('licenseNumber')?.updateValueAndValidity();
    });
  }

  // getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.registerForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: error => {
          this.error = error.error?.message || 'Registration failed';
          this.loading = false;
        }
      });
  }
}
