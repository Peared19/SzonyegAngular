/**
 * Comment model for user comments on carpets
 */
export class Comment {
  id: string;
  carpetId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
  isEdited: boolean;
  
  constructor(data: Partial<Comment> = {}) {
    this.id = data.id || '';
    this.carpetId = data.carpetId || '';
    this.userId = data.userId || '';
    this.username = data.username || '';
    this.text = data.text || '';
    this.createdAt = data.createdAt || new Date();
    this.isEdited = data.isEdited || false;
  }

  get formattedDate(): string {
    return this.createdAt.toLocaleDateString();
  }
} 