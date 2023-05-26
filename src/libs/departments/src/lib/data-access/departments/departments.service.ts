import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Department, User } from '../../typings';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private readonly endpoint = 'api/departments';

  constructor(
    private httpClient: HttpClient,
  ){}

  get(): Observable<Department[]> {
    return this.httpClient.get<Department[]>(this.endpoint);
  }

  add(department: Partial<Department>): Observable<Department> {
    return this.httpClient.post<Department>(this.endpoint, department);
  }

  update(department: Department): Observable<void> {
    // It seems that in-memory-web-api does not support PATCH
    return this.httpClient.put<void>(`${this.endpoint}/${department.id}`, department);
  }

  delete(department: Department): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/${department.id}`);
  }

  getUsers(department: Department): Observable<User[]>{
    return this.httpClient.get<User[]>(`${this.endpoint}/${department.id}/users`);
  }

  addUser(department: Department, user: Partial<User>): Observable<User> {
    return this.httpClient.post<User>(`${this.endpoint}/${department.id}/users`, user);
  }

  updateUser(department: Department, user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.endpoint}/${department.id}/users/${user.id}`, user);
  }

  deleteUser(department: Department, user: User): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/${department.id}/users/${user.id}`);
  }
}