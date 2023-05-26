import { Injectable } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { DepartmentsService } from './departments.service';
import { Department, DepartmentsState, User } from '../../typings';

@Injectable()
export class DepartmentsStore extends ComponentStore<DepartmentsState> {
  private readonly departments$ = this.select((state) => state.departments);
  private readonly users$ = this.select((state) => state.users);
  private readonly loading$ = this.select((state) => state.loading);
  private readonly error$ = this.select((state) => state.error);
  readonly vm$ = this.select(
    {
      departments: this.departments$,
      users: this.users$,
      loading: this.loading$,
      error: this.error$,
    },
    { debounce: true }
  );

  constructor(
    private departmentsService: DepartmentsService,
  ) {
    const initialState = {
      departments: [],
      users: {},
      loading: false,
    };
    super(initialState);
    this.getDepartments();
  }

  // Effects
  readonly getDepartments = this.effect<void>(
    pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap(() => this.departmentsService.get().pipe(
        tapResponse(
          (departments) => this.patchState({ departments, loading: false }),
          (error: Error) =>
            this.patchState({ error: error.message, loading: false })
        )
      ))
    )
  );

  readonly addDepartment = this.effect<Partial<Department>>(
    pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((department) => this.departmentsService.add(department).pipe(
        tapResponse(
          (updatedDepartment) => this.addOneUpdater(updatedDepartment),
          (error: Error) =>
            this.patchState({ error: error.message, loading: false })
        )
      ))
    )
  );

  readonly updateDepartment = this.effect<Department>(
    pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((department) => this.departmentsService.update(department).pipe(
        tapResponse(
          () => this.updateOneUpdater(department),
          (error: Error) =>
            this.patchState({ error: error.message, loading: false })
        )
      ))
    )
  );

  readonly deleteDepartment = this.effect<Department>(
    pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((department) => this.departmentsService.delete(department).pipe(
        tapResponse(
          () => this.deleteOneUpdater(department),
          (error: Error) =>
            this.patchState({ error: error.message, loading: false })
        )
      ))
    )
  );

  readonly getUsers = this.effect<Department>(
    pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap((department) => this.departmentsService.getUsers(department).pipe(
        tapResponse(
          (users) => this.updateUsersUpdater({[department.id!]: users }),
          (error: Error) =>
            this.patchState({ error: error.message, loading: false })
        )
      ))
    )
  );

  private readonly addOneUpdater = this.updater((state, department: Department) => ({
    ...state,
    error: undefined,
    loading: false,
    departments: [department, ...state.departments],
  }));

  private readonly updateOneUpdater = this.updater((state, updatedDepartment: Department) => ({
    ...state,
    error: undefined,
    loading: false,
    departments: state.departments.map((department) => (department.id === updatedDepartment.id ? { ...updatedDepartment } : department)),
  }));

  private readonly deleteOneUpdater = this.updater((state, departmentToDelete: Department) => ({
    ...state,
    error: undefined,
    loading: false,
    departments: state.departments.filter((department) => (department.id !== departmentToDelete.id)),
  }));

  private readonly updateUsersUpdater = this.updater((state, users: { [key: number]: User[] }) => {
    return ({
      ...state,
      error: undefined,
      loading: false,
      users: {
        ...state.users,
        ...users,
      },
    })
  });
}
