import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DepartmentsStore } from '../../data-access/departments/departments.store';
import { DialogService } from 'primeng/dynamicdialog';
import { Department, UsersMap } from '../../typings';
import { DepartmentFormComponent } from '../department-form/department-form.component';
import { AccordionTab, AccordionTabOpenEvent } from 'primeng/accordion';

@Component({
  selector: 'nsp-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DepartmentsStore,
    DialogService,
  ]
})
export class DepartmentsListComponent {
  vm$ = this.departmentsStore.vm$;

  constructor(
    private readonly departmentsStore: DepartmentsStore,
    public dialogService: DialogService,
  ){}

  openDepartmentFormDialog(event: MouseEvent, department?: Department) {
    event.stopPropagation();

    this.dialogService.open(DepartmentFormComponent, {
      data: { department },
      header: `${department?.id ? 'Edit Department' : 'Add Department'}`,
      width: '50vw',
    });
  }

  deleteDepartment(event: MouseEvent, department: Department) {
    event.stopPropagation();

    this.departmentsStore.deleteDepartment(department);
  }

  getDepartmentUsers(event: AccordionTabOpenEvent, departments: Department[]) {
    const accordionTabIndex = event.index;
    const department = departments[accordionTabIndex];

    this.departmentsStore.getUsers(department);
  }

  getDepartmentUserCount(department: Department, users: UsersMap): string {
    return `${users?.[department.id]?.length != null ? users?.[department.id]?.length : department?.users?.length}`;
  }
}
