import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.cartItemsSubject.next(this.loadCart());
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItemsSubject.next(items);
  }

  addToCart(item: CartItem): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(i => i.carpetId === item.carpetId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
      this.saveCart([...currentItems]);
    } else {
      this.saveCart([...currentItems, item]);
    }
  }

  removeItem(carpetId: string): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.carpetId !== carpetId);
    this.saveCart(updatedItems);
  }

  updateQuantity(carpetId: string, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(i => i.carpetId === carpetId);
    
    if (item) {
      item.quantity = quantity;
      this.saveCart([...currentItems]);
    }
  }

  getCartTotal(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((total, item) => total + item.totalPrice, 0))
    );
  }

  clearCart(): void {
    this.saveCart([]);
  }

  private loadCart(): CartItem[] {
    const data = localStorage.getItem('cart');
    if (data) {
      const items = JSON.parse(data);
      // Rehydrate to CartItem instances
      return items.map((item: any) =>
        new CartItem(item.carpetId, item.name, item.price, item.imageUrl, item.quantity)
      );
    }
    return [];
  }
} 