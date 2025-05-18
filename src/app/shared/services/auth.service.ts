import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, authState, User as FirebaseUser } from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection, getDoc, DocumentSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { User } from '../models/user.model'; // Import the local User model

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<FirebaseUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    authState(this.auth).subscribe(user => {
      console.log('Auth state changed:', user);
      this.userSubject.next(user);
    });
  }

  async register(email: string, password: string, username: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        const userDocRef = doc(this.firestore, 'users', userCredential.user.uid);
        await setDoc(userDocRef, {
          email,
          username,
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      // Redirect to the home page after successful logout
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user)
    );
  }

  getCurrentUser(): Observable<FirebaseUser | null> {
    return this.user$;
  }

  getUserData(uid: string): Observable<User | null> {
    const userDocRef = doc(this.firestore, 'users', uid);
    return from(getDoc(userDocRef)).pipe(
      map((snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          return new User({ ...snapshot.data() as any, id: snapshot.id });
        } else {
          return null;
        }
      })
    );
  }

  async updateUserData(uid: string, data: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', uid);
    await setDoc(userDocRef, data, { merge: true });
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Password reset email sent.');
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
} 