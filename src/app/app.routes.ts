import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: 'departments', loadChildren: () => import('@nsp/departments').then((m) => m.DepartmentsModule) },
  { path: '', redirectTo: '/departments', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];
