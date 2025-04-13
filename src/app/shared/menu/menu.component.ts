import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatLine } from '@angular/material/core';
import { MenuService } from './menu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatLine
  ]
})
export class MenuComponent implements OnInit, OnDestroy {
  @Output() selectedPage: EventEmitter<string> = new EventEmitter();

  isMenuOpen = false;
  currentPage = 'home';

  private subscription!: Subscription;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.subscription = this.menuService.action$.subscribe(action => {
      if (action === 'toggleMenu') {
        this.isMenuOpen = !this.isMenuOpen;
      } else if (action.startsWith('setPage:')) {
        const page = action.split(':')[1];
        this.setPage(page);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setPage(pagename: string) {
    this.currentPage = pagename;
    this.selectedPage.emit(pagename);
    this.isMenuOpen = false;
  }

  search(query: string): void {
    if (query && query.trim()) {
      console.log('Searching for:', query);
    }
  }
}
