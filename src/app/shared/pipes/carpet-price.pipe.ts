import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'carpetPrice',
  standalone: true
})
export class CarpetPricePipe implements PipeTransform {


  transform(price: number, currencySymbol = '$'): string {
    if (price === undefined || price === null) {
      return '';
    }

    return `${currencySymbol}${price.toFixed(2)}`;
  }
}
