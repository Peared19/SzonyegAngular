import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { CartService } from '../../shared/services/cart.service';
import { CartItem } from '../../shared/models/cart-item.model';
import { CartTotalPipe } from '../../shared/pipes/cart-total.pipe';
import { CartQuantityPipe } from '../../shared/pipes/cart-quantity.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';
import { OrderService } from '../../shared/services/order.service';
import { Order, OrderItem } from '../../shared/models/order.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDialogModule,
    CartTotalPipe,
    CartQuantityPipe
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  displayedColumns: string[] = ['image', 'name', 'price', 'quantity', 'total', 'actions'];
  cartSubscription: Subscription = new Subscription();
  currentUser: User | null = null;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });

    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.authService.getUserData(user.uid).subscribe(userData => {
          this.currentUser = userData;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      this.cartService.updateQuantity(item.carpetId, newQuantity);
    }
  }

  removeItem(carpetId: string): void {
    this.cartService.removeItem(carpetId);
    this.snackBar.open('Item removed from cart', 'Close', { duration: 3000 });
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.snackBar.open('Cart cleared', 'Close', { duration: 3000 });
  }

  async onSubmit(): Promise<void> {
    if (!this.currentUser?.address) {
      this.snackBar.open('Please set your address in your profile before placing an order', 'Close', { duration: 5000 });
      return;
    }
    if (!this.currentUser?.id || !this.currentUser?.username) {
      this.snackBar.open('User information is incomplete.', 'Close', { duration: 5000 });
      return;
    }
    const order: Order = {
      userId: this.currentUser.id,
      username: this.currentUser.username,
      email: this.currentUser.email,
      address: this.currentUser.address,
      items: this.cartItems.map(item => ({
        carpetId: item.carpetId,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: item.quantity
      })),
      total: this.cartItems.reduce((sum, item) => sum + item.totalPrice, 0),
      createdAt: new Date()
    };
    try {
      await this.orderService.placeOrder(order);
      this.clearCart();
      this.snackBar.open('Order placed successfully!', 'Close', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Failed to place order. Please try again.', 'Close', { duration: 5000 });
    }
  }
} 