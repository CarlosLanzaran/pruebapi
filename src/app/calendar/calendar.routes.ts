import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./features/calendar-page/calendar-page.component').then(m => m.CalendarPageComponent),
  },
] as Routes;
