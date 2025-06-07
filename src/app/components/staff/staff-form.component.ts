import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffService } from '../../services/staff.service';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-staff-form',
  templateUrl: './staff-form.component.html',
  styleUrls: ['./staff-form.component.scss']
})
export class StaffFormComponent implements OnInit {
  staffForm: FormGroup;
  staffId: number | null = null;
  loading = false;
  error = '';
  roles = [Role.ROLE_DOCTOR, Role.ROLE_SECRETARY];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required],
      address: [''],
      role: ['', Validators.required],
      specialization: [''],
      licenseNumber: [''],
      department: [''],
      position: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.staffId = +id;
      this.isEditMode = true;
      this.loadStaffMember();
      this.staffForm.get('password')?.setValidators([]); // Password optional in edit mode
    }
  }

  private async loadStaffMember(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      const staff = await this.staffService.getStaffById(this.staffId!).toPromise();
      if (staff) {
        this.staffForm.patchValue({
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
          phoneNumber: staff.phoneNumber,
          address: staff.address,
          role: staff.role,
          specialization: staff.specialization,
          licenseNumber: staff.licenseNumber,
          department: staff.department,
          position: staff.position
        });
      }
    } catch (error) {
      this.error = `Error loading staff member: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.staffForm.invalid) {
      return;
    }

    try {
      this.loading = true;
      this.error = '';

      const formData = this.staffForm.value;
      if (this.isEditMode) {
        if (!formData.password) {
          delete formData.password;
        }
        await this.staffService.updateStaffMember(this.staffId!, formData).toPromise();
      } else {
        await this.staffService.createStaffMember(formData).toPromise();
      }

      this.router.navigate(['/staff']);
    } catch (error) {
      this.error = `Error ${this.isEditMode ? 'updating' : 'creating'} staff member: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`;
    } finally {
      this.loading = false;
    }
  }

  onRoleChange(): void {
    const role = this.staffForm.get('role')?.value;
    if (role === Role.ROLE_DOCTOR) {
      this.staffForm.get('specialization')?.setValidators(Validators.required);
      this.staffForm.get('licenseNumber')?.setValidators(Validators.required);
      this.staffForm.get('department')?.clearValidators();
      this.staffForm.get('position')?.clearValidators();
    } else if (role === Role.ROLE_SECRETARY) {
      this.staffForm.get('department')?.setValidators(Validators.required);
      this.staffForm.get('position')?.setValidators(Validators.required);
      this.staffForm.get('specialization')?.clearValidators();
      this.staffForm.get('licenseNumber')?.clearValidators();
    }

    ['specialization', 'licenseNumber', 'department', 'position'].forEach(field => {
      this.staffForm.get(field)?.updateValueAndValidity();
    });
  }

  cancel(): void {
    this.router.navigate(['/staff']);
  }
}
