import { createServiceFactory, SpectatorService, mockProvider } from '@ngneat/spectator/jest';
import { DepartmentsStore } from './departments.store';
import { DepartmentsService } from './departments.service';
import { of, throwError } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('DepartmentsStore', () => {
  let spectator: SpectatorService<DepartmentsStore>;
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
  const newDepartment = {
    ...mockDepartments[0],
    id: 222
  };
  const updatedDepartment = {
    ...mockDepartments[0],
    name: 'UpdatedName'
  };
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
          delete: jest.fn(() => of(updatedDepartment))
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
        jest.spyOn(spectator.service, 'addOneUpdater');

        spectator.service.addDepartment(newDepartment);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.addOneUpdater).toHaveBeenCalledWith(newDepartment);
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
        jest.spyOn(spectator.service, 'updateOneUpdater');

        spectator.service.updateDepartment(updatedDepartment);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });        
        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.updateOneUpdater).toHaveBeenCalledWith(updatedDepartment);
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
        jest.spyOn(spectator.service, 'deleteOneUpdater');

        spectator.service.deleteDepartment(mockDepartments[0]);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.deleteOneUpdater).toHaveBeenCalledWith(mockDepartments[0]);
      });

      it('should delete the error state', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service.departmentsService, 'delete').mockImplementation(() => throwError({ message: 'Horror' }));

        spectator.service.deleteDepartment(newDepartment);

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        expect(spectator.service.patchState).toHaveBeenCalledWith({ error: 'Horror', loading: false });
      });
    });
  });
});