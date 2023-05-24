import { Route } from '@angular/router';
import { DepartmentsListComponent } from './feature/list/list.component';

export const departmentsRoutes: Route[] = [
  { 
    path: '', 
    component: DepartmentsListComponent,
  },
];
