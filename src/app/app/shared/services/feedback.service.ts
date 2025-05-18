import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Firestore, collection, query, where, getDocs, addDoc, DocumentData, CollectionReference } from '@angular/fire/firestore';
import { Comment } from '../models/comment.model';
import { Rating } from '../models/rating.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private commentsCollection: CollectionReference<DocumentData>;
  private ratingsCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.commentsCollection = collection(this.firestore, 'comments');
    this.ratingsCollection = collection(this.firestore, 'ratings');
  }

  getComments(carpetId: string): Observable<Comment[]> {
    const q = query(this.commentsCollection, where('carpetId', '==', carpetId));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)))
    );
  }

  getRatings(carpetId: string): Observable<Rating[]> {
    const q = query(this.ratingsCollection, where('carpetId', '==', carpetId));
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rating)))
    );
  }

  getAverageRating(carpetId: string): Observable<number> {
    return this.getRatings(carpetId).pipe(
      map(ratings => {
        if (ratings.length === 0) return 0;
        const totalScore = ratings.reduce((acc, curr) => acc + curr.score, 0);
        return Number((totalScore / ratings.length).toFixed(1));
      })
    );
  }

  async addComment(carpetId: string, text: string): Promise<void> {
    const firebaseAuthUser = await this.authService.getCurrentUser().pipe(map(user => user)).toPromise(); // Get Firebase Auth user as Promise

    if (!firebaseAuthUser) {
      throw new Error('User not authenticated');
    }

    const newComment: Partial<Comment & DocumentData> = {
      carpetId: carpetId,
      userId: firebaseAuthUser.uid,
      username: firebaseAuthUser.email || 'Anonymous', // Use email from Firebase Auth user, fallback to Anonymous
      text: text,
      createdAt: new Date(),
      isEdited: false
    };

    await addDoc(this.commentsCollection, newComment);
  }

  async addRating(carpetId: string, score: number): Promise<void> {
    const firebaseAuthUser = await this.authService.getCurrentUser().pipe(map(user => user)).toPromise(); // Get Firebase Auth user as Promise

    if (!firebaseAuthUser) {
      throw new Error('User not authenticated');
    }

    const newRating: Partial<Rating & DocumentData> = {
      carpetId: carpetId,
      userId: firebaseAuthUser.uid,
      username: firebaseAuthUser.email || 'Anonymous', // Use email from Firebase Auth user, fallback to Anonymous
      score: score,
      createdAt: new Date()
    };

    await addDoc(this.ratingsCollection, newRating);
  }
}
