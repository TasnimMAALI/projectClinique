import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  Role = Role;
  currentUser$ = this.authService.currentUser;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Additional initialization if needed
  }

  get welcomeMessage(): string {
    const user = this.authService.currentUserValue;
    if (!user) return '';
    
    const role = user.role.replace('ROLE_', '').toLowerCase();
    return `Welcome ${user.firstName} ${user.lastName} (${role})`;
  }
}
