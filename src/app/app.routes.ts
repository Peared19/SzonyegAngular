import { Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { CarpetsComponent } from './pages/carpets/carpets.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'carpets',
    loadComponent: () => import('./pages/carpets/carpets.component').then(m => m.CarpetsComponent).catch(err => {
      console.error('Error loading CarpetsComponent:', err);

      throw err;
    })
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'admin/add-carpet',
    loadComponent: () => import('./pages/admin/add-carpet.component').then(m => m.AddCarpetComponent),
    canActivate: [AuthGuard],
    data: { adminOnly: true }
  }
];
