import { DepartmentsStore } from './../../data-access/departments/departments.store';
import {
  Spectator,
  SpyObject,
  byTestId,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DepartmentFormComponent } from '../form/department-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';


describe('DepartmentFormComponent', () => {
  let spectator: Spectator<DepartmentFormComponent>;
  let departmentsStore: SpyObject<DepartmentsStore>;
  let dynamicDialogConfig: SpyObject<DynamicDialogConfig>;
  let dynamicDialogRef: SpyObject<DynamicDialogRef>;
  const mockDepartment = {
    "id": 1,
    "name": "Marketing",
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "johndoe@company.com"
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "janesmith@company.com"
      },
    ]
  };

  const createComponent = createComponentFactory({
    component: DepartmentFormComponent,
    imports: [
      ReactiveFormsModule,
      ButtonModule,
      AutoCompleteModule,
    ],
    mocks: [DynamicDialogRef],
    providers: [
      mockProvider(DepartmentsStore, {
        updateDepartment: jest.fn(),
        addDepartment: jest.fn(() => ({})),
      }),
      mockProvider(DynamicDialogConfig, {
        data: { department: mockDepartment }
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    departmentsStore = spectator.inject(DepartmentsStore);
    dynamicDialogConfig = spectator.inject(DynamicDialogConfig);
    dynamicDialogRef = spectator.inject(DynamicDialogRef);
  });

  it('should perform the correct save operation and close the dialog', () => {
    spectator.component.saveDepartment({name: 'test', users: []});

    expect(departmentsStore.addDepartment).toHaveBeenCalled();
    expect(dynamicDialogRef.close).toHaveBeenCalled();

    spectator.component.saveDepartment({ id: 1, name: 'test', users: [] });

    expect(departmentsStore.updateDepartment).toHaveBeenCalled();
    expect(dynamicDialogRef.close).toHaveBeenCalled();
  });


  it('should edit a department', () => {
    const newDepartmentName = 'NewDepName';
    const nameInput = spectator.query(byTestId('department-form-name')) as HTMLInputElement;
    const usersInput = spectator.query(byTestId('department-form-users'));
    const submitButton = spectator.query(byTestId('department-form-submit'));    

    expect(nameInput.value).toBe(mockDepartment.name);

    spectator.typeInElement(newDepartmentName, nameInput!);
    spectator.click(submitButton!);

    expect(departmentsStore.updateDepartment).toHaveBeenCalledWith({
      name: newDepartmentName,
      users: mockDepartment.users,
      id: mockDepartment.id
    });
  });
});
