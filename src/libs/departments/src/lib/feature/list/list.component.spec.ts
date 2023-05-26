import { DepartmentsListComponent } from './list.component';
import { DepartmentsStore } from './../../data-access/departments/departments.store';
import {
  Spectator,
  SpyObject,
  byTestId,
  createComponentFactory,
  mockProvider,
} from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { DepartmentFormComponent } from '../form/department-form.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
      TableModule,
      AccordionModule,
      BadgeModule,
      ButtonModule,
      ProgressSpinnerModule,
    ],
    mocks: [DialogService],
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
    // departmentsStore = spectator.inject(DepartmentsStore);
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

        it('should display the users table when the block is open and has users', () => {
          expect(spectator.query(byTestId('department-users-table'))).toExist();
          expect(
            spectator.query(byTestId('department-users-table'))?.querySelectorAll('[data-testid="department-users-table-row"]').length
          ).toBe(mockDepartments[0].users.length);

          // The second department (mockDepartments[1]) has no users
          expect(
            spectator.queryAll(byTestId('department-users-table'))[1]?.querySelectorAll('[data-testid="department-users-table"]')
          ).not.toExist();
        });

        it('should display the user data on each row if users', () => {
          const userRow = spectator.query(byTestId('department-users-table'));

          expect(
            userRow?.querySelector('[data-testid="user-id"]')?.textContent
          ).toEqual(`${mockDepartments[0].users[0].id}`);
          expect(
            userRow?.querySelector('[data-testid="user-name"]')?.textContent
          ).toBe(mockDepartments[0].users[0].name);
          expect(
            userRow?.querySelector('[data-testid="user-email"]')?.textContent
          ).toBe(mockDepartments[0].users[0].email);
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
        height: '50vh'
      });
    });

    it('should open the "Edit department" modal with the department', () => {
      spectator.click(byTestId('department-list-edit-button'));

      expect(dialogService.open).toHaveBeenCalledWith(DepartmentFormComponent, {
        data: { department: mockDepartments[0] },
        header: 'Edit Department',
        width: '50vw',
        height: '50vh'
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
      spectator.click(byTestId('department-list-department'));

      // @ts-expect-error - Skipping lint errors for testing purposes
      expect(spectator.component.departmentsStore.getUsers).toHaveBeenCalledWith(mockDepartments[0]);
    });
  });
});