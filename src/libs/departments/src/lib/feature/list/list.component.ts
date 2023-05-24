import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DepartmentsStore } from '../../data-access/departments/departments.store';

@Component({
  selector: 'nsp-departments-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DepartmentsStore
  ]
})
export class DepartmentsListComponent {
  vm$ = this.departmentsStore.vm$;

  constructor(
    private readonly departmentsStore: DepartmentsStore,
  ){}
}
