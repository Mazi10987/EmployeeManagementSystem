import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Employee } from '../../../models/employee';
import { EmployeeService } from '../../../core/services/employee.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SignalRService } from '../../../core/services/signalr.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'employeeCode',
    'name',
    'email',
    'salary',
    'actions'
  ];

  @ViewChild(MatSort)
sort!: MatSort;

@ViewChild(MatPaginator)
paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Employee>();

  constructor(
   private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
   
    this.loadEmployees();

this.signalRService.onEmployeeCreated((employeeName) => {

  alert(employeeName + ' Created Successfully');

  this.loadEmployees();

});
  }

  ngAfterViewInit(): void {

    this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

}

  loadEmployees(): void {

      this.employeeService
      .getEmployees()
      .subscribe({

        next: data => {

          this.dataSource.data = data;

        }

      });
  }

  deleteEmployee(id:number){

    if(!confirm("Are you sure you want to delete this employee?"))
        return;

    this.employeeService
        .deleteEmployee(id)
        .subscribe({

            next:()=>{

                this.snackBar.open(
                    "Employee Deleted Successfully",
                    "Close",
                    {
                        duration:3000
                    });

                this.loadEmployees();

            },

            error:(err)=>{

                console.log(err);

            }

        });

}

applyFilter(event: Event): void {

  const filterValue =
      (event.target as HTMLInputElement).value;

  this.dataSource.filter =
      filterValue.trim().toLowerCase();

}


}