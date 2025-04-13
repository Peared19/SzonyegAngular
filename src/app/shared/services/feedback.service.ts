import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Comment } from '../models/comment.model';
import { Rating } from '../models/rating.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private comments: Comment[] = [
    new Comment({
      id: '1',
      carpetId: '1',
      userId: 'user1',
      username: 'John Doe',
      text: 'Gyonyoru perzsa szonyeg! A szinek meg szebb eloben.',
      createdAt: new Date('2024-03-10')
    }),
    new Comment({
      id: '2',
      carpetId: '2',
      userId: 'user2',
      username: 'Jane Smith',
      text: 'Modern dizajn, tokeletesen illik a nappalimba.',
      createdAt: new Date('2024-03-12')
    }),
    new Comment({
      id: '3',
      carpetId: '1',
      userId: 'user3',
      username: 'Mike Johnson',
      text: 'Kivalo minoseg az arhoz kepest. Mindenkepp ajanlom!',
      createdAt: new Date('2024-03-15')
    })
  ];

  private ratings: Rating[] = [
    new Rating({
      id: '1',
      carpetId: '1',
      userId: 'user1',
      username: 'John Doe',
      score: 5,
      createdAt: new Date('2024-03-10')
    }),
    new Rating({
      id: '2',
      carpetId: '2',
      userId: 'user2',
      username: 'Jane Smith',
      score: 4,
      createdAt: new Date('2024-03-12')
    }),
    new Rating({
      id: '3',
      carpetId: '1',
      userId: 'user3',
      username: 'Mike Johnson',
      score: 5,
      createdAt: new Date('2024-03-15')
    }),
    new Rating({
      id: '4',
      carpetId: '3',
      userId: 'user4',
      username: 'Sarah Wilson',
      score: 3,
      createdAt: new Date('2024-03-16')
    })
  ];

  constructor() { }

  getComments(carpetId: string): Observable<Comment[]> {
    return of(this.comments.filter(comment => comment.carpetId === carpetId));
  }

  getRatings(carpetId: string): Observable<Rating[]> {
    return of(this.ratings.filter(rating => rating.carpetId === carpetId));
  }

  getAverageRating(carpetId: string): Observable<number> {
    const carpetRatings = this.ratings.filter(rating => rating.carpetId === carpetId);
    if (carpetRatings.length === 0) return of(0);
    
    const average = carpetRatings.reduce((acc, curr) => acc + curr.score, 0) / carpetRatings.length;
    return of(Number(average.toFixed(1)));
  }

  addComment(comment: Partial<Comment>): Observable<Comment> {
    const newComment = new Comment({
      ...comment,
      id: (this.comments.length + 1).toString(),
      createdAt: new Date()
    });
    this.comments.push(newComment);
    return of(newComment);
  }

  addRating(rating: Partial<Rating>): Observable<Rating> {
    const newRating = new Rating({
      ...rating,
      id: (this.ratings.length + 1).toString(),
      createdAt: new Date()
    });
    this.ratings.push(newRating);
    return of(newRating);
  }
} 