import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { departmentsRoutes } from './departments.routes';
import { DepartmentsListComponent } from './feature/departments-list/departments-list.component';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { UsersListComponent } from './feature/users-list/users-list.component';
import { DepartmentFormComponent } from './feature/department-form/department-form.component';
import { UserFormComponent } from './feature/user-form/user-form.component';

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
    InputTextModule,
    ProgressSpinnerModule,
    DropdownModule,
    ProgressBarModule,
  ],
  declarations: [
    DepartmentsListComponent,
    DepartmentFormComponent,
    UserFormComponent,
    UsersListComponent,
  ],
})
export class DepartmentsModule {}
