import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    
    if (currentUser) {
      // check if route is restricted by role
      if (route.data['roles'] && !route.data['roles'].includes(currentUser.role)) {
        // role not authorized, redirect to home page
        this.router.navigate(['/']);
        return false;
      }

      // authorized, return true
      return true;
    }

    // not logged in, redirect to login page with return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
