import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { DepartmentsStore } from './departments.store';
import { mockProvider } from '@ngneat/spectator';
import { DepartmentsService } from './departments.service';
import { lastValueFrom, of, throwError } from 'rxjs';
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
          get: jest.fn(() => of(mockDepartments))
        }
      ),
    ]
  });

  beforeEach(() => {
    spectator = createService();
  });

  describe('Effects', () => {
    describe('getDepartments', () => {
      it('should get the departments', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service.departmentsService, 'get');

        spectator.service.getDepartments();

        // @ts-expect-error - Skipping lint errors for testing purposes
        expect(spectator.service.departmentsService.get).toHaveBeenCalled()
      });

      it('should update the departments state', () => {
        jest.spyOn(spectator.service, 'patchState');

        spectator.service.getDepartments();

        expect(spectator.service.patchState).toHaveBeenCalledWith({ departments: mockDepartments, loading: false });
      });

      it('should update the loading state', () => {
        jest.spyOn(spectator.service, 'patchState');

        spectator.service.getDepartments();

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        expect(spectator.service.patchState).toHaveBeenCalledWith({ departments: mockDepartments, loading: false });
      });

      it('should update the error state', () => {
        // @ts-expect-error - Skipping lint errors for testing purposes
        jest.spyOn(spectator.service.departmentsService, 'get').mockImplementation(() => throwError({ message: 'Horror' }));
        jest.spyOn(spectator.service, 'patchState');

        spectator.service.getDepartments();

        expect(spectator.service.patchState).toHaveBeenCalledWith({ loading: true });
        expect(spectator.service.patchState).toHaveBeenCalledWith({ error: 'Horror', loading: false });
      });
    });
  });
});