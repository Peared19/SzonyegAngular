import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription, switchMap } from 'rxjs';
import { OrderService } from '../../shared/services/order.service';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  private userSubscription: Subscription | undefined;
  isLoading = true;

  newAddress: string = '';
  orders: Order[] = [];

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUser().pipe(
      switchMap(firebaseUser => {
        if (firebaseUser) {
          return this.authService.getUserData(firebaseUser.uid);
        } else {
          return [null];
        }
      })
    ).subscribe(async firestoreUser => {
      this.user = firestoreUser;
      if (this.user) {
        this.newAddress = this.user.address || '';
        this.orders = await this.orderService.getOrdersByUserId(this.user.id);
      }
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async updateAddress() {
    if (this.user && this.newAddress.trim()) {
      this.isLoading = true;
      try {
        await this.authService.updateUserData(this.user.id, { address: this.newAddress.trim() });
        this.user.address = this.newAddress.trim();
        console.log('Address updated successfully!');
      } catch (error) {
        console.error('Error updating address:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      console.log('User not logged in or address is empty.');
    }
  }
}
