import { Routes } from '@angular/router';
import { Auth } from './features/auth/auth';
import { Home } from './features/home/home';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    component: Auth,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
