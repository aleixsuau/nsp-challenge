import { FormControl } from "@angular/forms";

export interface DepartmentsState {
  users: UsersMap;
  departments: Department[];
  loading: boolean;
  error?: string;
}

export interface Department {
  id: number;
  name: string;
  users: number[];
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface DepartmentForm {
  id?: FormControl<number | undefined>;
  name: FormControl<Department['name']>;
  users: FormControl<Department['users']>;
}

export interface UsersMap {
  [key: number]: User[];
}

export interface UserForm {
  id?: FormControl<number | undefined>;
  name: FormControl<User['name']>;
  email: FormControl<User['email']>;
}
