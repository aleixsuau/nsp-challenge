import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { departmentsRoutes } from './departments.routes';
import { DepartmentsListComponent } from './feature/list/list.component';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserFormComponent } from './feature/forms/user/user-form.component';
import { DepartmentFormComponent } from './feature/forms/department/department-form.component';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';

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
  ],
})
export class DepartmentsModule {}
