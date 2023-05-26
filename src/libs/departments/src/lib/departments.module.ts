import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { departmentsRoutes } from './departments.routes';
import { DepartmentsListComponent } from './feature/list/list.component';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DepartmentFormComponent } from './feature/form/department-form.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(departmentsRoutes),
    TableModule,
    AccordionModule,
    BadgeModule,
    ButtonModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    InputTextModule,
    ProgressSpinnerModule,
  ],
  declarations: [DepartmentsListComponent, DepartmentFormComponent],
})
export class DepartmentsModule {}
