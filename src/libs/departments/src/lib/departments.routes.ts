import { Route } from '@angular/router';
import { DepartmentsListComponent } from './feature/departments-list/departments-list.component';

export const departmentsRoutes: Route[] = [
  { 
    path: '', 
    component: DepartmentsListComponent,
  },
];
