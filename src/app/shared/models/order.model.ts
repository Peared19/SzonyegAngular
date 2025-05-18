export interface OrderItem {
  carpetId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  username: string;
  email: string;
  address: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
} 