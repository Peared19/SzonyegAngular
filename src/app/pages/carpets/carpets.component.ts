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

import { Carpet } from '../../shared/models/carpet.model';
import { CarpetService } from '../../shared/services/carpet.service';
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
    CarpetPricePipe
  ],
  templateUrl: './carpets.component.html',
  styleUrl: './carpets.component.scss'
})
export class CarpetsComponent implements OnInit {
  carpets: Carpet[] = [];
  loading = true;
  
  // Fixed carpet types
  carpetTypes = ['Persian', 'Modern', 'Traditional', 'Oriental'];
  
  // Filter options
  searchQuery = '';
  selectedType = '';
  inStockOnly = false;
  
  constructor(private carpetService: CarpetService) {}
  
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
        this.loading = false;
      },
      error => {
        console.error('Error loading carpets', error);
        this.loading = false;
      }
    );
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
}
