import { Pipe, PipeTransform } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

@Pipe({
  name: 'cartTotal',
  standalone: true
})
export class CartTotalPipe implements PipeTransform {
  transform(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  }
} 