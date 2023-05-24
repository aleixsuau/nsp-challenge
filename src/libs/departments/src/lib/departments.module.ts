import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { departmentsRoutes } from './departments.routes';
import { DepartmentsListComponent } from './feature/list/list.component';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(departmentsRoutes),
    TableModule,
    AccordionModule,
    BadgeModule
  ],
  declarations: [DepartmentsListComponent],
})
export class DepartmentsModule {}
