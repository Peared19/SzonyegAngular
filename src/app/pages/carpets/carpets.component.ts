import { Component, OnInit } from '@angular/core';
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

import { Carpet } from '../../shared/models/carpet.model';
import { Comment } from '../../shared/models/comment.model';
import { Rating } from '../../shared/models/rating.model';
import { CarpetService } from '../../shared/services/carpet.service';
import { FeedbackService } from '../../shared/services/feedback.service';
import { CarpetPricePipe } from '../../shared/pipes/carpet-price.pipe';

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
export class CarpetsComponent implements OnInit {
  carpets: (Carpet & { comments?: Comment[], ratings?: Rating[], averageRating?: number })[] = [];
  loading = true;
  
  // Fixed carpet types
  carpetTypes = ['Persian', 'Modern', 'Traditional', 'Oriental'];
  
  // Filter options
  searchQuery = '';
  selectedType = '';
  inStockOnly = false;

  // New comment form
  newComment = '';
  newRating = 0;
  
  constructor(
    private carpetService: CarpetService,
    private feedbackService: FeedbackService
  ) {}
  
  ngOnInit(): void {
    this.loadCarpets();
  }
  
  loadCarpets(): void {
    this.loading = true;
    this.carpetService.getFilteredCarpets(
      this.searchQuery, 
      this.selectedType, 
      this.inStockOnly
    ).subscribe(
      carpets => {
        this.carpets = carpets;
        this.loadFeedback();
      },
      error => {
        console.error('Error loading carpets', error);
        this.loading = false;
      }
    );
  }

  loadFeedback(): void {
    const feedbackPromises = this.carpets.map(carpet => {
      return Promise.all([
        this.feedbackService.getComments(carpet.id).toPromise(),
        this.feedbackService.getRatings(carpet.id).toPromise(),
        this.feedbackService.getAverageRating(carpet.id).toPromise()
      ]).then(([comments, ratings, averageRating]) => {
        carpet.comments = comments;
        carpet.ratings = ratings;
        carpet.averageRating = averageRating;
      });
    });

    Promise.all(feedbackPromises).then(() => {
      this.loading = false;
    });
  }
  
  applyFilters(): void {
    this.loadCarpets();
  }
  
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedType = '';
    this.inStockOnly = false;
    this.loadCarpets();
  }

  addComment(carpet: Carpet): void {
    if (!this.newComment.trim()) return;

    this.feedbackService.addComment({
      carpetId: carpet.id,
      userId: 'currentUser', // This will be replaced with actual user ID when auth is implemented
      username: 'Current User', // This will be replaced with actual username when auth is implemented
      text: this.newComment
    }).subscribe(() => {
      this.newComment = '';
      this.loadFeedback();
    });
  }

  addRating(carpet: Carpet): void {
    if (this.newRating < 1 || this.newRating > 5) return;

    this.feedbackService.addRating({
      carpetId: carpet.id,
      userId: 'currentUser', // This will be replaced with actual user ID when auth is implemented
      username: 'Current User', // This will be replaced with actual username when auth is implemented
      score: this.newRating
    }).subscribe(() => {
      this.newRating = 0;
      this.loadFeedback();
    });
  }

  getStars(score: number): string {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
  }
}
