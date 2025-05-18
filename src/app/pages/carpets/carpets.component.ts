import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { forkJoin, of, Subscription, combineLatest } from 'rxjs';
import { switchMap, catchError, tap, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Carpet } from '../../shared/models/carpet.model';
import { Comment } from '../../shared/models/comment.model';
import { Rating } from '../../shared/models/rating.model';
import { CarpetService } from '../../shared/services/carpet.service';
import { FeedbackService } from '../../shared/services/feedback.service';
import { CarpetPricePipe } from '../../shared/pipes/carpet-price.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { User as FirebaseUser } from '@angular/fire/auth';
import { CartService } from '../../shared/services/cart.service';
import { CartItem } from '../../shared/models/cart-item.model';

@Component({
  selector: 'app-carpets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDividerModule,
    CarpetPricePipe
  ],
  templateUrl: './carpets.component.html',
  styleUrl: './carpets.component.scss'
})
export class CarpetsComponent implements OnInit, OnDestroy {
  carpets: (Carpet & { comments?: Comment[], ratings?: Rating[], averageRating?: number, hasUserRated?: boolean })[] = [];
  loading = true;
  
  carpetTypes = ['Persian', 'Modern', 'Traditional', 'Oriental'];
  
  searchQuery = '';
  selectedType = '';

  newComment = '';
  newRating = 0;
  
  currentUser: FirebaseUser | null = null;
  private authSubscription: Subscription | undefined;

  constructor(
    private carpetService: CarpetService,
    private feedbackService: FeedbackService,
    private authService: AuthService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    console.log('CarpetsComponent initialized');
    this.authSubscription = this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
    this.loadCarpets();
  }
  
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  
  loadCarpets(): void {
    console.log('Loading carpets...');
    this.loading = true;
    this.carpetService.getFilteredCarpets(
      this.searchQuery,
      this.selectedType
    ).subscribe({
      next: (carpets) => {
        console.log('Carpets loaded:', carpets);
        this.carpets = carpets;
        this.loadFeedback();
      },
      error: (error) => {
        console.error('Error loading carpets', error);
        this.loading = false;
      }
    });
  }

  loadFeedback(): void {
    console.log('Loading feedback...', this.carpets.length);
    if (this.carpets.length === 0) {
      this.loading = false;
      console.log('No carpets to load feedback for. Loading set to false.');
      return;
    }

    const feedbackObservables = this.carpets.map(carpet => {
      return combineLatest([
        this.feedbackService.getComments(carpet.id),
        this.feedbackService.getRatings(carpet.id),
        this.feedbackService.getAverageRating(carpet.id),
        this.currentUser ? this.feedbackService.getUserRating(carpet.id, this.currentUser.uid).pipe(catchError(() => of(undefined))) : of(undefined) 
      ]).pipe(
        map(([comments, ratings, averageRating, userRating]) => {
          carpet.comments = comments;
          carpet.ratings = ratings;
          carpet.averageRating = averageRating;
          carpet.hasUserRated = !!userRating;
          return carpet;
        }),
        catchError(error => {
          console.error('Error loading feedback for carpet', carpet.id, error);
          return of(carpet);
        })
      );
    });

    forkJoin(feedbackObservables).subscribe({
      next: () => {
        this.loading = false;
        console.log('Feedback loaded. Loading set to false.');
      },
      error: (error) => {
        console.error('Error loading feedback', error);
        this.loading = false;
      }
    });
  }
  
  applyFilters(): void {
    console.log('Applying filters...');
    this.loadCarpets();
  }
  
  resetFilters(): void {
    console.log('Resetting filters...');
    this.searchQuery = '';
    this.selectedType = '';
    this.loadCarpets();
  }

  addComment(carpet: Carpet): void {
    if (!this.newComment.trim()) {
      console.log('Comment is empty.');
      return;
    }
    if (!this.currentUser) {
      console.log('User not authenticated to add comment.');
      return;
    }
    console.log('Adding comment...');

    this.feedbackService.addComment(carpet.id, this.newComment)
      .then(() => {
        console.log('Comment added.');
        this.newComment = '';
        this.loadFeedbackForCarpet(carpet.id);
      }).catch(error => {
        console.error('Error adding comment:', error);
      });
  }

  addRating(carpet: Carpet & { hasUserRated?: boolean }): void {
    if (this.newRating < 1 || this.newRating > 5) {
      console.log('Invalid rating.');
      return;
    }
    if (!this.currentUser) {
      console.log('User not authenticated to add rating.');
      return;
    }
    if (carpet.hasUserRated) {
      console.log('User has already rated this carpet.');
      return;
    }
    console.log('Adding rating...');

    this.feedbackService.addRating(carpet.id, this.newRating)
      .then(() => {
        console.log('Rating added.');
        this.newRating = 0;
        this.loadFeedbackForCarpet(carpet.id);
      }).catch(error => {
        console.error('Error adding rating:', error);
      });
  }

  loadFeedbackForCarpet(carpetId: string): void {
    const carpetIndex = this.carpets.findIndex(c => c.id === carpetId);
    if (carpetIndex > -1) {
      const carpet = this.carpets[carpetIndex];
      combineLatest([
        this.feedbackService.getComments(carpet.id),
        this.feedbackService.getRatings(carpet.id),
        this.feedbackService.getAverageRating(carpet.id),
        this.currentUser ? this.feedbackService.getUserRating(carpet.id, this.currentUser.uid).pipe(catchError(() => of(undefined))) : of(undefined)
      ]).pipe(
        map(([comments, ratings, averageRating, userRating]) => {
          carpet.comments = comments;
          carpet.ratings = ratings;
          carpet.averageRating = averageRating;
          carpet.hasUserRated = !!userRating;
          return carpet;
        }),
        catchError(error => {
          console.error('Error loading feedback for carpet', carpet.id, error);
          return of(carpet);
        })
      ).subscribe(() => {
        console.log('Feedback for carpet', carpet.id, 'reloaded.');
      });
    }
  }

  getStars(score: number): string {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
  }

  addToCart(carpet: Carpet): void {
    const cartItem = new CartItem(
      carpet.id,
      carpet.name,
      carpet.price,
      carpet.imageUrl,
      1
    );
    this.cartService.addToCart(cartItem);
    this.snackBar.open('Added to cart', 'Close', { duration: 3000 });
  }
}
