import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DepartmentsStore } from '../../data-access/departments/departments.store';
import { DialogService } from 'primeng/dynamicdialog';
import { Department, User, UsersMap } from '../../typings';
import { DepartmentFormComponent } from '../forms/department/department-form.component';
import { UserFormComponent } from '../forms/user/user-form.component';

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

  getDepartmentUsers(department: Department) {
    this.departmentsStore.getUsers(department);
  }

  openUserFormDialog(departments: Department[], department?: Department, user?: User) {
    this.dialogService.open(UserFormComponent, {
      data: { 
        user,
        department,
        departments,
      },
      header: `${user?.id ? 'Edit User' : 'Add User'}`,
      width: '50vw',
    });
  }

  deleteUser(department: Department, user: User) {
    this.departmentsStore.deleteUser({ department, user });
  }

  getCountBadgeValue(department: Department, users: UsersMap): string {
    return `${users?.[department.id]?.length != null ? users?.[department.id]?.length : department?.users?.length}`;
  }
}
