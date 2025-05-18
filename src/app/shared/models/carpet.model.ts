export class Carpet {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  imageUrl: string;
  
  constructor(data: Partial<Carpet> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.price = data.price || 0;
    this.type = data.type || 'Modern';
    this.imageUrl = data.imageUrl || 'assets/images/placeholder-carpet.jpg';
  }
} 