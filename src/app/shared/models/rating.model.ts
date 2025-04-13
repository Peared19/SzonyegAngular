/**
 * ertekeles modell a szonyegekhez
 */
export interface Rating {
  id: string;
  carpetId: string;
  userId: string;
  username: string;
  score: number; // 1-5 stars
  createdAt: Date;
  formattedDate: string;
}

export class Rating {
  id: string;
  carpetId: string;
  userId: string;
  username: string;
  score: number; // 1-5 stars
  createdAt: Date;
  
  constructor(data: Partial<Rating> = {}) {
    this.id = data.id || '';
    this.carpetId = data.carpetId || '';
    this.userId = data.userId || '';
    this.username = data.username || '';
    this.score = data.score || 0;
    this.createdAt = data.createdAt || new Date();
  }

  get isValid(): boolean {
    return this.score >= 1 && this.score <= 5;
  }

  get stars(): string {
    return '★'.repeat(this.score) + '☆'.repeat(5 - this.score);
  }
} 