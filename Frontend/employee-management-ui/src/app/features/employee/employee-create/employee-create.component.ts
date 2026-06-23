import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EmployeeService } from '../../../core/services/employee.service';
import { CreateEmployeeRequest } from '../../../models/create-employee-reques';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.css'
})
export class EmployeeCreateComponent {

  employeeForm!: FormGroup;
  
  constructor(private fb: FormBuilder,  private employeeService: EmployeeService,
    private snackBar: MatSnackBar,   private router: Router) {
    this.employeeForm = this.fb.group({

      employeeCode: ['', Validators.required],
    
      firstName: ['', Validators.required],
    
      lastName: ['', Validators.required],
    
      email: ['', [Validators.required, Validators.email]],
    
      salary: [0, Validators.required],
    
      dateOfJoining: ['', Validators.required]
    
    });
  }

  saveEmployee(): void {

    if (this.employeeForm.invalid) {
  
      this.employeeForm.markAllAsTouched();
  
      return;
    }
  
    this.employeeService
        .createEmployee(this.employeeForm.value as CreateEmployeeRequest)
        .subscribe({
  
          next: () => {
  
            this.snackBar.open(
  
              'Employee created successfully',
  
              'Close',
  
              {
                duration: 3000
              });
  
            this.router.navigate(['/employees']);
  
          },
  
          error: (error) => {
  
            console.error(error);
  
            this.snackBar.open(
  
              'Unable to create employee',
  
              'Close',
  
              {
                duration: 3000
              });
  
          }
  
        });
  
  }

}
