import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('../shared/ui/layout.component').then(m => m.default),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/routine-list/routine-list.component').then(m => m.RoutineListComponent),
      },
      {
        path: 'new',
        loadComponent: () => import('./features/routine-form/routine-form.component').then(m => m.RoutineFormComponent),
      },
      {
        path: 'edit/:idRoutine',
        loadComponent: () => import('./features/routine-form/routine-form.component').then(m => m.RoutineFormComponent),
      },
    ],
  },
] as Routes;
