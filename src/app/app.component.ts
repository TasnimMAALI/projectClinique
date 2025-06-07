import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User, Role } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;
  Role = Role;
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    const user = this.authService.currentUserValue;
    if (user) {
      this.currentUser = user;
      this.isLoggedIn = true;
    }
  }

  hasRole(roles: Role[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
