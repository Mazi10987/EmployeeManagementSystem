import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './core/layout/layout/layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EmployeeCreateComponent } from './features/employee/employee-create/employee-create.component';
import { EmployeeEditComponent } from './features/employee/employee-edit/employee-edit.component';
import { EmployeeListComponent } from './features/employee/employee-list/employee-list.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'employees',
        component: EmployeeListComponent
      },

      {
        path: 'employees/create',
        component: EmployeeCreateComponent
      },

      {
        path: 'employees/edit/:id',
        component: EmployeeEditComponent
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];