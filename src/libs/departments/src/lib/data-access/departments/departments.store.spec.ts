import { createServiceFactory, SpectatorService, mockProvider } from '@ngneat/spectator/jest';
import { DepartmentsStore } from './departments.store';
import { DepartmentsService } from './departments.service';
import { of, throwError } from 'rxjs';

describe('DepartmentsStore', () => {
  let spectator: SpectatorService<DepartmentsStore>;
  const mockDepartments = [
    {
      "id": 1,
      "name": "Marketing",
      "users": [1, 2]
    },
    {
      "id": 2,
      "name": "Sales",
      "users": [3, 4]
    }
  ];
  const newDepartment = {
    ...mockDepartments[0],
    id: 222
  };
  const updatedDepartment = {
    ...mockDepartments[0],
    name: 'UpdatedName'
  };
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
    error: null
  };
  const createService = createServiceFactory({
    service: DepartmentsStore,
    providers: [
      mockProvider(
        DepartmentsService,
        {
          get: jest.fn(() => of(mockDepartments)),
          add: jest.fn(() => of(newDepartment)),
          update: jest.fn(() => of(updatedDepartment)),
          delete: jest.fn(() => of(updatedDepartment)),
          getUsers: jest.fn(() => of(mockUsers)),
        }
      ),
    ]
  });

  beforeEach(() => {
    spectator = createService();
    jest.spyOn(spectator.service, 'patchState');
  });

  describe('Effects', () => {
    describe('getDepartments', () => {
      it('should get the departments', () => {
        spectator.service.getDepartments();

        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.departmentsService.get).toHaveBeenCalled()
      });

      it('should update the departments state', () => {
        spectator.service.getDepartments();

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        expect(spectator.service.patchState).toHaveBeenCalledWith({ departments: mockDepartments, loading: false });
      });

      it('should update the error state', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service.departmentsService, 'get').mockImplementation(() => throwError({ message: 'Horror' }));

        spectator.service.getDepartments();

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        expect(spectator.service.patchState).toHaveBeenCalledWith({ error: 'Horror', loading: false });
      });
    });

    describe('addDepartment', () => {
      it('should add the department', () => {
        spectator.service.addDepartment(mockDepartments[0]);

        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.departmentsService.add).toHaveBeenCalled()
      });

      it('should update the departments state', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service, 'addOneDepartmentUpdater');

        spectator.service.addDepartment(newDepartment);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.addOneDepartmentUpdater).toHaveBeenCalledWith(newDepartment);
      });

      it('should update the error state', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service.departmentsService, 'add').mockImplementation(() => throwError({ message: 'Horror' }));

        spectator.service.addDepartment(newDepartment);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        expect(spectator.service.patchState).toHaveBeenCalledWith({ error: 'Horror', loading: false });
      });
    });


    describe('updateDepartment', () => {
      it('should update the department', () => {
        spectator.service.updateDepartment(updatedDepartment);

        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.departmentsService.update).toHaveBeenCalled()
      });

      it('should update the departments state', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service, 'updateOneDepartmentUpdater');

        spectator.service.updateDepartment(updatedDepartment);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });        
        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.updateOneDepartmentUpdater).toHaveBeenCalledWith(updatedDepartment);
      });

      it('should update the error state', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service.departmentsService, 'update').mockImplementation(() => throwError({ message: 'Horror' }));

        spectator.service.updateDepartment(updatedDepartment);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        expect(spectator.service.patchState).toHaveBeenCalledWith({ error: 'Horror', loading: false });
      });
    });

    describe('deleteDepartment', () => {
      it('should delete the department', () => {
        spectator.service.deleteDepartment(mockDepartments[0]);

        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.departmentsService.delete).toHaveBeenCalled()
      });

      it('should delete the departments state', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service, 'deleteOneDepartmentUpdater');

        spectator.service.deleteDepartment(mockDepartments[0]);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.deleteOneDepartmentUpdater).toHaveBeenCalledWith(mockDepartments[0]);
      });

      it('should update the error state', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service.departmentsService, 'delete').mockImplementation(() => throwError({ message: 'Horror' }));

        spectator.service.deleteDepartment(newDepartment);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        expect(spectator.service.patchState).toHaveBeenCalledWith({ error: 'Horror', loading: false });
      });
    });

    describe('getUsers', () => {
      it('should get users', () => {
        spectator.service.getUsers(mockDepartments[0]);

        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.departmentsService.getUsers).toHaveBeenCalled();
      });

      it('should update the users state', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service, 'updateUsersUpdater');

        spectator.service.getUsers(mockDepartments[0]);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.updateUsersUpdater).toHaveBeenCalledWith({ [mockDepartments[0].id]: mockUsers });
      });

      it('should update the error state', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service.departmentsService, 'getUsers').mockImplementation(() => throwError({ message: 'Horror' }));

        spectator.service.getUsers(mockDepartments[0]);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        expect(spectator.service.patchState).toHaveBeenCalledWith({ error: 'Horror', loading: false });
      });
    });
  });
});