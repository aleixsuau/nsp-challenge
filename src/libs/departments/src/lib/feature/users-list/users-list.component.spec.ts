import { Spectator, SpyObject, byTestId, createComponentFactory, mockProvider } from "@ngneat/spectator/jest";
import { ButtonModule } from "primeng/button";
import { DialogService } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { of } from "rxjs";
import { DepartmentsStore } from "../../data-access/departments/departments.store";
import { UsersListComponent } from "./users-list.component";
import { Department } from "../../typings";
import { UserFormComponent } from "../user-form/user-form.component";
import { MockComponent } from "ng-mocks";

describe('UsersListComponent', () => {
  let spectator: Spectator<UsersListComponent>;
  let dialogService: SpyObject<DialogService>;

  const mockDepartments: Department[] = [
    {
      "id": 1,
      "name": "Marketing",
      "users": [
        1, 2
      ]
    },
    {
      "id": 2,
      "name": "Sales",
      "users": [
       3, 4
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
  
  const createComponent = createComponentFactory({
    component: UsersListComponent,
    imports: [
      TableModule,
      ButtonModule,
    ],
    mocks: [DialogService],
    declarations: [
      MockComponent(UserFormComponent)
    ],
    componentProviders: [
      mockProvider(DepartmentsStore, {
        deleteUser: jest.fn(() => of({})),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        users: mockUsers,
        departmentsList: mockDepartments,
        currentDepartment: mockDepartments[0]
      },
    });
    dialogService = spectator.inject(DialogService);
  });

  describe('UI', () => {
    it('should display the users list if users', () => {
      expect(spectator.query(byTestId('users-list'))).toExist();
      expect(
        spectator.query(byTestId('users-list'))?.querySelectorAll('[data-testid="users-list-row"]').length
      ).toBe(mockDepartments[0].users.length);

      // The second department (mockDepartments[1]) has no users
      expect(
        spectator.queryAll(byTestId('users-list'))[1]?.querySelectorAll('[data-testid="users-list"]')
      ).not.toExist();
    });

    it('should display the user data on each row if users', () => {
      const userRow = spectator.query(byTestId('users-list'));

      expect(
        userRow?.querySelector('[data-testid="user-id"]')?.textContent
      ).toEqual(`${mockUsers[0].id}`);
      expect(
        userRow?.querySelector('[data-testid="user-name"]')?.textContent
      ).toBe(mockUsers[0].name);
      expect(
        userRow?.querySelector('[data-testid="user-email"]')?.textContent
      ).toBe(mockUsers[0].email);
    });
  });

  describe('Functionality', () => {
    it('should open the "Add user" modal with the department', () => {
      spectator.click(byTestId('users-list-edit-button'));

      expect(dialogService.open).toHaveBeenCalledWith(UserFormComponent, {
        data: {
          user: mockUsers[0],
          department: mockDepartments[0],
          departments: mockDepartments,
        },
        header: 'Edit User',
        width: '50vw',
      });
    });

    it('should delete users', () => {
      // @ts-expect-error - Skipping lint errors for testing purposes
      jest.spyOn(spectator.component.departmentsStore, 'deleteUser').mockImplementation(() => of([]));
      spectator.click(byTestId('users-list-delete-button'));

      // @ts-expect-error - Skipping lint errors for testing purposes
      expect(spectator.component.departmentsStore.deleteUser).toHaveBeenCalledWith({
        user: mockUsers[0],
        department: mockDepartments[0],
      });
    });
  });
});