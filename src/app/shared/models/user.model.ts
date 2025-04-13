/**
 * felhasznalo modell
 */
export class User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  role: 'user' | 'admin';
  createdAt: Date;
  
  constructor(data: Partial<User> = {}) {
    this.id = data.id || '';
    this.username = data.username || '';
    this.email = data.email || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.address = data.address || '';
    this.phoneNumber = data.phoneNumber || '';
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date();
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }
} 