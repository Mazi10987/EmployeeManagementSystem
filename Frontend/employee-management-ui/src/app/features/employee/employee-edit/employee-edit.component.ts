import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EmployeeService } from '../../../core/services/employee.service';
import { UpdateEmployeeRequest } from '../../../models/update-employee-request';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css'
})
export class EmployeeEditComponent implements OnInit {

  employeeId!: number;

  employeeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {

    this.employeeForm = this.fb.group({

      employeeCode: ['', Validators.required],

      firstName: ['', Validators.required],

      lastName: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      salary: [0, Validators.required],

      dateOfJoining: ['', Validators.required]

    });

  }

  ngOnInit(): void {

    this.employeeId =
      Number(this.route.snapshot.paramMap.get('id'));

    this.loadEmployee();

  }

  loadEmployee(): void {

    this.employeeService
      .getEmployeeById(this.employeeId)
      .subscribe({

        next: (employee) => {

          this.employeeForm.patchValue(employee);

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

  updateEmployee(): void {

    if (this.employeeForm.invalid) {

      this.employeeForm.markAllAsTouched();

      return;

    }

    this.employeeService
      .updateEmployee(
        this.employeeId,
        this.employeeForm.value as UpdateEmployeeRequest
      )
      .subscribe({

        next: () => {

          this.snackBar.open(
            'Employee updated successfully',
            'Close',
            {
              duration: 3000
            });

          this.router.navigate(['/employees']);

        },

        error: (err) => {

          console.log(err);

          this.snackBar.open(
            'Update failed',
            'Close',
            {
              duration: 3000
            });

        }

      });

  }

}