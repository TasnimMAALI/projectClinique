import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Staff } from '../../models/staff.model';
import { StaffService } from '../../services/staff.service';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  staffMembers: Staff[] = [];
  loading = false;
  error = '';

  constructor(
    private staffService: StaffService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStaffMembers();
  }

  private async loadStaffMembers(): Promise<void> {
    try {
      this.loading = true;
      this.error = '';
      const user = this.authService.currentUserValue;

      if (!user) {
        this.error = 'User not authenticated';
        return;
      }

      if (user.role === Role.ROLE_ADMIN) {
        this.staffMembers = await this.staffService.getAllStaff().toPromise() || [];
      } else if (user.role === Role.ROLE_SECRETARY) {
        this.staffMembers = await this.staffService.getAllDoctors().toPromise() || [];
      } else {
        this.error = 'Unauthorized access';
      }
    } catch (error) {
      this.error = `Error loading staff members: ${error instanceof Error ? error.message : 'Unknown error'}`;
    } finally {
      this.loading = false;
    }
  }

  addStaffMember(): void {
    this.router.navigate(['/staff/new']);
  }

  editStaffMember(id: number): void {
    this.router.navigate([`/staff/${id}/edit`]);
  }

  async deleteStaffMember(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this staff member?')) {
      try {
        await this.staffService.deleteStaffMember(id).toPromise();
        this.staffMembers = this.staffMembers.filter(staff => staff.id !== id);
      } catch (error) {
        this.error = `Error deleting staff member: ${error instanceof Error ? error.message : 'Unknown error'}`;
      }
    }
  }
}
