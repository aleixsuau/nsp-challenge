export interface DepartmentsState {
  departments: Department[];
  loading: boolean;
  error?: string;
}

export interface Department {
  id: number;
  name: string;
  users: User[];
}

export interface User {
  id: number;
  name: string;
  email: string;
}
