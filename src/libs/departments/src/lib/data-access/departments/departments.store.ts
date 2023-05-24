import { Injectable } from '@angular/core';
import { pipe, switchMap, tap } from 'rxjs';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { DepartmentsService } from './departments.service';
import { DepartmentsState } from '../../typings';

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
}