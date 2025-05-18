import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  isMenuOpen = false;
  showMenu$: Observable<boolean> | undefined;
  isLoggedIn$: Observable<boolean>;
  cartItems$: Observable<CartItem[]>;
  isAdmin = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.isLoggedIn$ = this.authService.isAuthenticated();
    this.cartItems$ = this.cartService.cartItems$;
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(firebaseUser => {
      if (firebaseUser) {
        this.authService.getUserData(firebaseUser.uid).subscribe(user => {
          this.isAdmin = user?.role === 'admin';
        });
      } else {
        this.isAdmin = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  // Removed search method
}
