import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Department, User, UserForm } from '../../../typings';
import { DepartmentsStore } from '../../../data-access/departments/departments.store';

@Component({
  selector: 'nsp-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent implements OnInit {
  userForm = this.formBuilder.nonNullable.group<UserForm>({
    id: this.formBuilder.nonNullable.control(undefined),
    name: this.formBuilder.nonNullable.control('', { validators: [Validators.required] }),
    email: this.formBuilder.nonNullable.control('', { validators: [Validators.required, Validators.email] })
  });
  userToEdit?: User;
  departmentsList?: Department[];
  userDepartment = new FormControl<Department | undefined>(undefined);
  userOriginalDepartment?: Department;

  constructor(
    private formBuilder: FormBuilder,
    private departmentsStore: DepartmentsStore,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
  ) { }

  ngOnInit() {
    this.userToEdit = this.dynamicDialogConfig.data?.user;
    this.userOriginalDepartment = this.dynamicDialogConfig.data?.department;
    this.departmentsList = this.dynamicDialogConfig.data?.departments;

    if (this.userToEdit) {
      this.userForm.setValue(this.userToEdit);
      this.userDepartment.setValue(this.userOriginalDepartment);
    }
  }

  saveUser(user: Partial<User> | User) {
    let department;

    if (user.id) {
      department = this.userDepartment.getRawValue()!;
      const previousDepartment = department.id !== this.userOriginalDepartment!.id ? this.userOriginalDepartment : undefined;

      this.departmentsStore.updateUser({ department: department, user: user as User, previousDepartment  });
    } else {
      department = this.dynamicDialogConfig.data?.department;
      this.departmentsStore.addUser({ department, user });
    }
    this.dynamicDialogRef.close();
  }
}
