import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, defaultIfEmpty, map, retry, throwError } from 'rxjs';
import { Id } from '../core/models/object.models';
import { DepartmentModel } from '../models/department.model';
import { DepartmentReadDTO, fromDepartmentReadDTO } from './dto/department-dto';

@Injectable({
  providedIn: 'root',
})
export class DepartmentApiService {
  private url = 'api/departments';

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<DepartmentModel[]> {
    return this.http.get<DepartmentReadDTO[]>(this.url).pipe(
      map((dtos) => dtos.map((dto) => fromDepartmentReadDTO(dto))),
      retry(2),
      catchError((res: HttpErrorResponse) => throwError(() => res)),
      defaultIfEmpty([])
    );
  }

  getDepartmentById(id: Id): Observable<DepartmentModel | null> {
    return this.http.get<DepartmentReadDTO>(`${this.url}/${id}`).pipe(
      map((dto) => fromDepartmentReadDTO(dto)),
      retry(2),
      catchError((res: HttpErrorResponse) => throwError(() => res)),
      defaultIfEmpty(null)
    );
  }

  updateDepartmentById(department: DepartmentModel): Observable<DepartmentModel | null> {
    return this.http.put<DepartmentReadDTO>(`${this.url}/${department.id}`, department).pipe(
      map((dto) => fromDepartmentReadDTO(dto)),
      retry(2),
      catchError((res: HttpErrorResponse) => throwError(() => res)),
      defaultIfEmpty(null)
    );
  }

  deleteDepartmentById(department: DepartmentModel): Observable<DepartmentModel | null> {
    return this.http.delete<null>(`${this.url}/${department.id}`).pipe(
      map(() => department),
      retry(2),
      catchError((res: HttpErrorResponse) => throwError(() => res)),
      defaultIfEmpty(null)
    );
  }

  createDepartment(name: string): Observable<DepartmentModel | null> {
    return this.http.post<DepartmentReadDTO>(`${this.url}`, { name }).pipe(
      map((dto) => fromDepartmentReadDTO(dto)),
      retry(2),
      catchError((res: HttpErrorResponse) => throwError(() => res)),
      defaultIfEmpty(null)
    );
  }
}
