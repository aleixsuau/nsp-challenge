import { FormControl } from "@angular/forms";

export interface DepartmentsState {
  departments: Department[];
  loading: boolean;
  error?: string;
}

export interface Department {
  id?: number;
  name: string;
  users: User[];
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface DepartmentForm {
  id?: FormControl<Department['id']>;
  name: FormControl<Department['name']>;
  users: FormControl<Department['users']>;
}
