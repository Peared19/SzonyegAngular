import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AppComponent} from '../../app.component';
import {HomeComponent} from '../../pages/home/home.component';
import {MatAnchor, MatButton,MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink, HomeComponent, MatAnchor, MatAnchor,MatButtonModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent{
  @Output()  selectedPage: EventEmitter<string> = new EventEmitter();
  isMenuOpen = false;


  constructor() {
    console.log('Hello konstruktor');
  }

  setPage(pagename: string) {
    this.selectedPage.emit(pagename);
  }
}
