/**
 * felhasznalo modell
 */
export class User {
  id: string;
  username: string;
  email: string;
  address: string;
  role: 'user' | 'admin';
  createdAt: Date;
  
  constructor(data: Partial<User> = {}) {
    this.id = data.id || '';
    this.username = data.username || '';
    this.email = data.email || '';
    this.address = data.address || '';
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date();
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }
} 