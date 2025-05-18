/**
 * CartItem model representing an item in the user's shopping cart
 */
export class CartItem {
  constructor(
    public carpetId: string,
    public name: string,
    public price: number,
    public imageUrl: string,
    public quantity: number = 1
  ) {}

  get totalPrice(): number {
    return this.price * this.quantity;
  }
} 