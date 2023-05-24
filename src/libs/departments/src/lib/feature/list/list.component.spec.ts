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


describe('PetListComponent', () => {
  let spectator: Spectator<DepartmentsListComponent>;
  let departmentsStore: SpyObject<DepartmentsStore>;
  
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
  const mockVm = {
    departments: mockDepartments,
    loading: false,
    error: null
  };

  const createComponent = createComponentFactory({
    component: DepartmentsListComponent,
    imports: [
      TableModule,
      AccordionModule,
      BadgeModule
    ],
    mocks: [DepartmentsStore],
    componentProviders: [
      mockProvider(DepartmentsStore, {
        vm$: of(mockVm),
        getDepartments: jest.fn(() => of({})),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    departmentsStore = spectator.inject(DepartmentsStore);
  });

  describe('UI', () => {
    it('should display the title', () => {
      expect(spectator.query(byTestId('department-list-title'))).toExist();
    });

    describe('List', () => {
      it('should display the list', () => {
        expect(spectator.query(byTestId('department-list-departments'))).toExist();
      });

      describe('Blocks', () => {
        it('should display one block per department', () => {
          expect(spectator.queryAll(byTestId('department-list-block'))?.length).toBe(mockDepartments.length);
        });

        it('should display the name of the department', () => {
          expect(
            spectator.query(byTestId('department-list-department'))?.querySelector('[data-testid="department-name"]')?.textContent
          ).toContain(mockDepartments[0].name);
        });

        it('should display the users table on each row', () => {
          expect(spectator.query(byTestId('department-users-table'))).toExist();
          expect(
            spectator.query(byTestId('department-users-table'))?.querySelectorAll('[data-testid="department-users-table-row"]').length
          ).toBe(mockDepartments[0].users.length);
        });

        it('should display the user data on each row', () => {
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
});