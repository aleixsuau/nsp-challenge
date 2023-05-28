import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Department, User } from '../../typings';
import { DialogService } from 'primeng/dynamicdialog';
import { DepartmentsStore } from '../../data-access/departments/departments.store';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'nsp-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  @Input({ required: true }) users?: User[];
  @Input({ required: true }) currentDepartment?: Department;
  @Input({ required: true }) departmentsList?: Department[];

  @Output() userEdit = new EventEmitter<User>();
  @Output() userDelete = new EventEmitter<User>();

  constructor(
    private readonly departmentsStore: DepartmentsStore,
    public dialogService: DialogService,
  ){}

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
}
