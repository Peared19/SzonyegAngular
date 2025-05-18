import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CarpetService } from '../../shared/services/carpet.service';

@Component({
  selector: 'app-add-carpet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './add-carpet.component.html',
  styleUrl: './add-carpet.component.scss'
})
export class AddCarpetComponent {
  name = '';
  price: number | null = null;
  type = '';
  imageUrl = '';
  description = '';

  selectedFile: File | null = null;

  isLoading = false;

  constructor(private carpetService: CarpetService, private snackBar: MatSnackBar, private router: Router) {}

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  async addCarpet() {
    if (!this.name.trim() || !this.price || !this.type.trim() || !this.selectedFile) {
      this.snackBar.open('Please fill in all required fields and select an image.', 'Close', { duration: 3000 });
      return;
    }
    this.isLoading = true;
    try {
      const imageUrl = await this.carpetService.uploadCarpetImage(this.selectedFile);

      await this.carpetService.addCarpet({
        name: this.name.trim(),
        price: this.price,
        type: this.type.trim(),
        imageUrl: imageUrl,
        description: this.description.trim()
      });
      this.snackBar.open('Carpet added successfully!', 'Close', { duration: 3000 });
      this.router.navigate(['/carpets']);
    } catch (error) {
      this.snackBar.open('Failed to add carpet.', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }
} 