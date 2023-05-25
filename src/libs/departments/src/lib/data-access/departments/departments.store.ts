import { Injectable } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { DepartmentsService } from './departments.service';
import { Department, DepartmentsState } from '../../typings';

@Injectable()
export class DepartmentsStore extends ComponentStore<DepartmentsState> {
  private readonly departments$ = this.select((state) => state.departments);
  private readonly loading$ = this.select((state) => state.loading);
  private readonly error$ = this.select((state) => state.error);
  readonly vm$ = this.select(
    {
      departments: this.departments$,
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

  readonly addDepartment = this.effect<Department>(
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

  private readonly addOneUpdater = this.updater((state, department: Department) => ({
    error: undefined,
    loading: false,
    departments: [department, ...state.departments],
  }));

  private readonly updateOneUpdater = this.updater((state, updatedDepartment: Department) => ({
    error: undefined,
    loading: false,
    departments: state.departments.map((department) => (department.id === updatedDepartment.id ? { ...updatedDepartment } : department)),
  }));

  private readonly deleteOneUpdater = this.updater((state, departmentToDelete: Department) => ({
    error: undefined,
    loading: false,
    departments: state.departments.filter((department) => (department.id !== departmentToDelete.id)),
  }));
}
