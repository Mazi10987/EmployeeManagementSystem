import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Employee } from '../../models/employee';
import { environment } from '../../../environments/environment';
import { CreateEmployeeRequest } from '../../models/create-employee-reques';
import { UpdateEmployeeRequest } from '../../models/update-employee-request';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${environment.apiUrl}/Employee`;

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  createEmployee(employee: CreateEmployeeRequest): Observable<any> {
    return this.http.post(this.apiUrl, employee);
  }

  getEmployeeById(id: number) {

  return this.http.get<Employee>(
    `${this.apiUrl}/${id}`
  );

}

updateEmployee(
  id: number,
  employee: UpdateEmployeeRequest) {

  return this.http.put(
    `${this.apiUrl}/${id}`,
    employee
  );

}
deleteEmployee(id: number) {

  return this.http.delete(
    `${this.apiUrl}/${id}`
  );
}}