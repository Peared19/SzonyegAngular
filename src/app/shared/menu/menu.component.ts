import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AppComponent} from '../../app.component';
import {HomeComponent} from '../../pages/home/home.component';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {MatLine} from '@angular/material/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatLine
  ]

})
export class MenuComponent{
  @Output()  selectedPage: EventEmitter<string> = new EventEmitter();
  isMenuOpen = false;
  currentPage='home';


  constructor() {
    console.log('Hello konstruktor');
  }

  setPage(pagename: string) {
    this.currentPage = pagename;
    this.selectedPage.emit(pagename);

    this.isMenuOpen=false;
  }
}
