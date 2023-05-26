import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DepartmentsStore } from '../../data-access/departments/departments.store';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DepartmentFormComponent } from '../form/department-form.component';
import { Department } from '../../typings';

@Component({
  selector: 'nsp-departments-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DepartmentsStore,
    DialogService,
  ]
})
export class DepartmentsListComponent {
  vm$ = this.departmentsStore.vm$;
  departmentFormDialogRef?: DynamicDialogRef;

  constructor(
    private readonly departmentsStore: DepartmentsStore,
    public dialogService: DialogService,
  ){}

  openDepartmentFormDialog(event: MouseEvent, department?: Department) {
    event.stopPropagation();

    this.departmentFormDialogRef = this.dialogService.open(DepartmentFormComponent, {
      data: { department },
      header: `${department?.id ? 'Edit Department' : 'Add Department'}`,
      width: '50vw',
      height: '50vh'
    })
  }

  deleteDepartment(event: MouseEvent, department: Department) {
    event.stopPropagation();

    this.departmentsStore.deleteDepartment(department);
  }

  getDepartmentUsers(department: Department) {
    this.departmentsStore.getUsers(department);
  }
}
