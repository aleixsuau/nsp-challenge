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
}