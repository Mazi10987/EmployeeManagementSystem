import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { AuthService }
from '../../../core/services/auth.service';
import { SignalRService } from '../../../core/services/signalr.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
     private signalRService: SignalRService,
  ) {

    this.loginForm = this.fb.group({
      userName: ['admin'],
      password: ['admin123'],
      role: ['Admin']
    });
  }

  login() {

    this.authService
      .login(this.loginForm.value)
      .subscribe({
        next: (response: any) => {

          localStorage.setItem(
            'token',
            response.token
          );

          localStorage.setItem('token', response.token);
          this.signalRService.startConnection();

          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }
}