import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { AuthService } from './shared/services/auth.service';
import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenuComponent
  ]
})
export class AppComponent implements OnInit {
  showMenu$: Observable<boolean>;
  title = 'AngularSzonyeg';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Always show the menu
    this.showMenu$ = of(true);
  }

  ngOnInit() {

  }
}


