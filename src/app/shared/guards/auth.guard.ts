import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const adminOnly = route.data['adminOnly'] === true;
    return this.authService.getCurrentUser().pipe(
      take(1),
      switchMap(firebaseUser => {
        if (!firebaseUser) {
          this.router.navigate(['/login']);
          return [false];
        }
        return this.authService.getUserData(firebaseUser.uid).pipe(
          take(1),
          map(user => {
            if (!user) {
              this.router.navigate(['/login']);
              return false;
            }
            if (adminOnly && user.role !== 'admin') {
              this.router.navigate(['/']);
              return false;
            }
            return true;
          })
        );
      })
    );
  }
} 