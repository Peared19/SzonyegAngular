import { Pipe, PipeTransform } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

@Pipe({
  name: 'cartQuantity',
  standalone: true
})
export class CartQuantityPipe implements PipeTransform {
  transform(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }
} 