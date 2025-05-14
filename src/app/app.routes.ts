import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/auth.guard';

export const routes: Routes = [
  // --- autenticación sigue igual
  {
    path: 'auth',
    canActivateChild: [ publicGuard() ],
    loadChildren: () => import('./auth/features/auth.routes'),
  },
  // --- Home: con LayoutComponent
  {
    path: 'home',
    canActivateChild: [ privateGuard() ],
    loadComponent: () => import('./shared/ui/layout.component'),
    loadChildren: () => import('./home/home.routes').then(m => m.HOME_ROUTES),
  },
  // --- Tasks: cargar Layout + sus child-routes
  {
    path: 'tasks',
    canActivateChild: [ privateGuard() ],
    loadComponent: () => import('./shared/ui/layout.component'),
    loadChildren: () => import('./task/features/task.routes'),
  },

  // --- Calendar: igual que Tasks, con header
  {
    path: 'calendar',
    canActivateChild: [ privateGuard() ],
    loadComponent: () => import('./shared/ui/layout.component'),
    loadChildren: () => import('./calendar/calendar.routes').then(m => m.routes),
  },

  // --- Routines: SIN LayoutComponent, así no duplica header
  {
    path: 'routines',
    canActivateChild: [ privateGuard() ],
    loadChildren: () => import('./routine/routine.routes'),
  },

  // --- fallback
  {
    path: '**',
    redirectTo: '/tasks',
  },
];
