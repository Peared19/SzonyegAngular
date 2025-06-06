import { Injectable } from '@angular/core';
import { Observable, of, from, firstValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Firestore, collection, query, where, getDocs, addDoc, DocumentData, CollectionReference } from '@angular/fire/firestore';
import { Comment } from '../models/comment.model';
import { Rating } from '../models/rating.model';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private commentsCollection: CollectionReference<DocumentData>;
  private ratingsCollection: CollectionReference<DocumentData>;

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
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

  getUserRating(carpetId: string, userId: string): Observable<Rating | undefined> {
    const q = query(this.ratingsCollection, where('carpetId', '==', carpetId), where('userId', '==', userId));
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          // Assuming only one rating per user per carpet, return the first one found
          const doc = snapshot.docs[0];
          return { id: doc.id, ...doc.data() } as Rating;
        } else {
          return undefined; // No rating found for this user and carpet
        }
      })
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
    console.log('FeedbackService: addComment called');
    const firebaseAuthUser = await firstValueFrom(this.authService.getCurrentUser().pipe(map(user => user)));
    console.log('FeedbackService: Got firebaseAuthUser', firebaseAuthUser);

    if (!firebaseAuthUser) {
      console.error('FeedbackService: User not authenticated');
      throw new Error('User not authenticated');
    }

    // Get user data to get the username
    console.log('FeedbackService: Getting user data for', firebaseAuthUser.uid);
    const userData = await firstValueFrom(this.authService.getUserData(firebaseAuthUser.uid));
    console.log('FeedbackService: Got userData', userData);

    if (!userData) {
      console.error('FeedbackService: User data not found');
      throw new Error('User data not found');
    }

    const newComment: Partial<Comment & DocumentData> = {
      carpetId: carpetId,
      userId: firebaseAuthUser.uid,
      username: userData.username,
      text: text,
      createdAt: new Date(),
      isEdited: false
    };

    console.log('FeedbackService: Adding document to Firestore', newComment);
    await addDoc(this.commentsCollection, newComment);
    console.log('FeedbackService: Document added successfully');
  }

  async addRating(carpetId: string, score: number): Promise<void> {
    const firebaseAuthUser = await firstValueFrom(this.authService.getCurrentUser().pipe(map(user => user)));

    if (!firebaseAuthUser) {
      throw new Error('User not authenticated');
    }

    // Get user data to get the username
    const userData = await firstValueFrom(this.authService.getUserData(firebaseAuthUser.uid));
    if (!userData) {
      throw new Error('User data not found');
    }

    const newRating: Partial<Rating & DocumentData> = {
      carpetId: carpetId,
      userId: firebaseAuthUser.uid,
      username: userData.username,
      score: score,
      createdAt: new Date()
    };

    await addDoc(this.ratingsCollection, newRating);
  }
} 