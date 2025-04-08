import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {NgIf} from '@angular/common';
import {ProfileComponent} from './pages/profile/profile.component';
import {MenuComponent} from './shared/menu/menu.component';
import {CarpetsComponent} from './pages/carpets/carpets.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, NgIf, ProfileComponent, MenuComponent, CarpetsComponent, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AngularSzonyeg';
  page='home';
  changePage(page: string){
    this.page = page;
  }
}


