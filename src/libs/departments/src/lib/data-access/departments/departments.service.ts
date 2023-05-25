import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Department } from '../../typings';

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

  add(department: Department): Observable<Department> {
    return this.httpClient.post<Department>(this.endpoint, department);
  }

  update(department: Department): Observable<void> {
    // It seems that in-memory-web-api does not support PATCH
    return this.httpClient.put<void>(`${this.endpoint}/${department.id}`, department);
  }

  delete(department: Department): Observable<void> {
    return this.httpClient.delete<void>(`${this.endpoint}/${department.id}`);
  }
}