import { FormBuilder, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DepartmentsStore } from '../../data-access/departments/departments.store';
import { Department, DepartmentForm } from '../../typings';


@Component({
  selector: 'nsp-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentFormComponent implements OnInit {
  departmentForm = this.formBuilder.nonNullable.group<DepartmentForm>({
    id: this.formBuilder.nonNullable.control(undefined),
    name: this.formBuilder.nonNullable.control('', { validators: [Validators.required]}),
    users: this.formBuilder.nonNullable.control([])
  });
  userSuggestions = [];

  constructor(
    private formBuilder: FormBuilder,
    private departmentsStore: DepartmentsStore,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
  ){}

  ngOnInit() {
    const departmentToEdit = this.dynamicDialogConfig.data?.department;

    if (departmentToEdit) {
      this.departmentForm.setValue(departmentToEdit);
    }
  }

  saveDepartment(department: Partial<Department> | Department) {
    if (department.id) {      
      this.departmentsStore.updateDepartment(department as Department);
    } else {
      this.departmentsStore.addDepartment(department as Partial<Department>);
    }
    this.dynamicDialogRef.close();
  }
}
