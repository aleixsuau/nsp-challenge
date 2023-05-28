import { DepartmentsListComponent } from './departments-list.component';
import { DepartmentsStore } from '../../data-access/departments/departments.store';
import {
  Spectator,
  SpyObject,
  byTestId,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DepartmentFormComponent } from '../department-form/department-form.component';
import { UsersListComponent } from '../users-list/users-list.component';
import { MockComponent } from 'ng-mocks';

describe('DepartmentsListComponent', () => {
  let spectator: Spectator<DepartmentsListComponent>;
  let dialogService: SpyObject<DialogService>;
  
  const mockDepartments = [
    {
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
    },
    {
      "id": 2,
      "name": "Sales",
      "users": [
        {
          "id": 3,
          "name": "Bob Johnson",
          "email": "bobjohnson@company.com"
        },
        {
          "id": 4,
          "name": "Alice Brown",
          "email": "alicebrown@company.com"
        }
      ]
    }
  ];
  const mockUsers = [
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
  ];
  const mockVm = {
    departments: mockDepartments,
    loading: false,
    error: null,
    users: {
      1: mockUsers
    },
  };

  const createComponent = createComponentFactory({
    component: DepartmentsListComponent,
    imports: [
      AccordionModule,
      BadgeModule,
      ButtonModule,
      ProgressSpinnerModule,
    ],
    mocks: [DialogService],
    declarations: [
      MockComponent(UsersListComponent)
    ],
    componentProviders: [
      mockProvider(DepartmentsStore, {
        vm$: of(mockVm),
        getDepartments: jest.fn(() => of({})),
        deleteDepartment: jest.fn(() => of({})),
        getUsers: jest.fn(() => of({})),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    dialogService = spectator.inject(DialogService);
  });

  describe('UI', () => {
    it('should display the title', () => {
      expect(spectator.query(byTestId('department-list-title'))).toExist();
    });

    describe('List', () => {
      it('should display the list', () => {
        expect(spectator.query(byTestId('department-list-departments'))).toExist();
      });

      it('should show the "Add department" button', () => {
        expect(spectator.query(byTestId('department-list-add-button'))).toExist();
      });

      describe('Department block', () => {
        it('should display one block per department', () => {
          expect(spectator.queryAll(byTestId('department-list-block'))?.length).toBe(mockDepartments.length);
        });

        it('should display the name of the department', () => {
          expect(
            spectator.query(byTestId('department-list-department'))?.querySelector('[data-testid="department-name"]')?.textContent
          ).toContain(mockDepartments[0].name);
        });

        it('should display the "Edit department" button', () => {
          expect(spectator.query(byTestId('department-list-edit-button'))).toExist();
        });

        it('should display the "Delete department" button', () => {
          expect(spectator.query(byTestId('department-list-delete-button'))).toExist();
        });

        it('should display the "Users list"', () => {
          expect(spectator.query(byTestId('department-list-users-list'))).toExist();
        });
      });      
    });
  });

  describe('Functionality', () => {
    it('should open the "Add department" modal with the department', () => {
      spectator.click(byTestId('department-list-add-button'));

      expect(dialogService.open).toHaveBeenCalledWith(DepartmentFormComponent, {
        data: { department: undefined },
        header: 'Add Department',
        width: '50vw',
      });
    });

    it('should open the "Edit department" modal with the department', () => {
      spectator.click(byTestId('department-list-edit-button'));

      expect(dialogService.open).toHaveBeenCalledWith(DepartmentFormComponent, {
        data: { department: mockDepartments[0] },
        header: 'Edit Department',
        width: '50vw',
      });
    });

    it('should delete departments', () => {
      // @ts-expect-error - Skipping lint errors for testing purposes
      jest.spyOn(spectator.component.departmentsStore, 'deleteDepartment').mockImplementation(() => of([]));
      spectator.click(byTestId('department-list-delete-button'));

      // @ts-expect-error - Skipping lint errors for testing purposes
      expect(spectator.component.departmentsStore.deleteDepartment).toHaveBeenCalledWith(mockDepartments[0]);
    });

    it('should get the users of the department when it is opened', () => {
      spectator.click(byTestId('department-list-block-header'));

      // @ts-expect-error - Skipping lint errors for testing purposes
      expect(spectator.component.departmentsStore.getUsers).toHaveBeenCalledWith(mockDepartments[0]);
    });
  });
});

