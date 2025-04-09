import { Pipe, PipeTransform } from '@angular/core';

/**
 * Simple pipe to format carpet prices
 * Usage: {{ price | carpetPrice }}
 * Or with a custom currency: {{ price | carpetPrice:'€' }}
 */
@Pipe({
  name: 'carpetPrice',
  standalone: true
})
export class CarpetPricePipe implements PipeTransform {

  /**
   * Transforms a number into a formatted price string
   * @param price The price value
   * @param currencySymbol Optional currency symbol (defaults to $)
   * @returns Formatted price string
   */
  transform(price: number, currencySymbol = '$'): string {
    if (price === undefined || price === null) {
      return '';
    }
    
    return `${currencySymbol}${price.toFixed(2)}`;
  }
} 